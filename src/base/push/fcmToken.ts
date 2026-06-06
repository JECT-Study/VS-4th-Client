import { getFirebaseApp, getFirebaseVapidKey } from "@base/push/firebaseConfig";
import { ensureServiceWorkerReady } from "@base/push/serviceWorker";
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

export const getFcmToken = async (): Promise<string> => {
  if (!(await isSupported())) {
    throw new FcmTokenError("이 브라우저는 Firebase Cloud Messaging을 지원하지 않습니다.", "UNSUPPORTED");
  }

  const registration = await ensureServiceWorkerReady();
  if (!registration) {
    throw new FcmTokenError("서비스 워커가 준비되지 않아 FCM 토큰을 발급할 수 없습니다.", "SERVICE_WORKER_UNAVAILABLE");
  }

  try {
    const messaging = getMessaging(getFirebaseApp());
    const token = await getToken(messaging, {
      vapidKey: getFirebaseVapidKey(),
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      throw new FcmTokenError("FCM 토큰이 비어 있습니다.", "TOKEN_REQUEST_FAILED");
    }

    return token;
  } catch (error) {
    if (error instanceof FcmTokenError) throw error;

    throw new FcmTokenError("FCM 토큰 발급에 실패했습니다.", "TOKEN_REQUEST_FAILED", error);
  }
};
