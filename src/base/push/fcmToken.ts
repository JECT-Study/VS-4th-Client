import { getFirebaseApp, getFirebaseVapidKey } from "@base/push/firebaseConfig";
import {
  ensureServiceWorkerReady,
  ServiceWorkerUnavailableError,
  type ServiceWorkerReadyMode,
} from "@base/push/serviceWorker";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

export class FcmTokenError extends Error {
  constructor(
    message: string,
    readonly code: "UNSUPPORTED" | "SERVICE_WORKER_UNAVAILABLE" | "TOKEN_REQUEST_FAILED",
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "FcmTokenError";
  }
}

const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
const GET_TOKEN_TIMEOUT_MS = 10_000;

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> => {
  let timeoutId: number | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(() => reject(new Error(`${label} timeout`)), timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  }
};

export type GetFcmTokenOptions = {
  mode?: ServiceWorkerReadyMode;
};

export const getFcmToken = async (options: GetFcmTokenOptions = {}): Promise<string> => {
  const mode = options.mode ?? "quick";

  if (!(await isSupported())) {
    throw new FcmTokenError("이 브라우저는 Firebase Cloud Messaging을 지원하지 않습니다.", "UNSUPPORTED");
  }

  let registration: ServiceWorkerRegistration | null;
  try {
    registration = await ensureServiceWorkerReady(mode);
  } catch (error) {
    if (error instanceof ServiceWorkerUnavailableError) {
      throw new FcmTokenError(error.message, "SERVICE_WORKER_UNAVAILABLE", error);
    }
    throw error;
  }

  if (!registration) {
    throw new FcmTokenError("서비스 워커가 준비되지 않아 FCM 토큰을 발급할 수 없습니다.", "SERVICE_WORKER_UNAVAILABLE");
  }

  const messaging = getMessaging(getFirebaseApp());
  const tokenOptions = {
    vapidKey: getFirebaseVapidKey(),
    serviceWorkerRegistration: registration,
  };

  const maxAttempts = mode === "interactive" ? 3 : 1;
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const token = await withTimeout(getToken(messaging, tokenOptions), GET_TOKEN_TIMEOUT_MS, "FCM getToken");

      if (!token) {
        throw new FcmTokenError("FCM 토큰이 비어 있습니다.", "TOKEN_REQUEST_FAILED");
      }

      return token;
    } catch (error) {
      if (error instanceof FcmTokenError) throw error;

      if (error instanceof ServiceWorkerUnavailableError) {
        throw new FcmTokenError(error.message, "SERVICE_WORKER_UNAVAILABLE", error);
      }

      lastError = error;

      if (attempt < maxAttempts - 1) {
        await sleep(600 * (attempt + 1));
      }
    }
  }

  throw new FcmTokenError("FCM 토큰 발급에 실패했습니다.", "TOKEN_REQUEST_FAILED", lastError);
};