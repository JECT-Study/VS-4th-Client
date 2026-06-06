const SERVICE_WORKER_URL = "/sw.js";
const POLL_INTERVAL_MS = 250;
const REGISTRATION_WAIT_MS = 15_000;
const ACTIVATION_WAIT_MS = 10_000;

let registrationPromise: Promise<ServiceWorkerRegistration | null> | null = null;
let cachedRegistration: ServiceWorkerRegistration | null = null;

export type ServiceWorkerReadyMode = "quick" | "interactive";

type RegisterSW = (options?: {
  immediate?: boolean;
  onRegisteredSW?: (swScriptUrl: string, registration: ServiceWorkerRegistration | undefined) => void;
  onRegisterError?: (error: unknown) => void;
}) => (reloadPage?: boolean) => Promise<void>;

export class ServiceWorkerUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServiceWorkerUnavailableError";
  }
}

const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> => {
  let timeoutId: number | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(() => {
          reject(new Error(`${label} timeout`));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  }
};

const getLocalDevHint = () =>
  "로컬 테스트는 `pnpm dev:pwa`로 실행해 주세요. (`pnpm dev`에는 sw.js가 없습니다)";

const isJavaScriptResponse = (contentType: string) =>
  contentType.includes("javascript") || contentType.includes("ecmascript");

const isServiceWorkerScriptAvailable = async () => {
  const response = await fetch(SERVICE_WORKER_URL, { method: "GET", cache: "no-store" });
  const contentType = response.headers.get("content-type") ?? "";
  return response.ok && isJavaScriptResponse(contentType);
};

/**
 * vite-plugin-pwa registerSW와 공유하는 등록 Promise를 초기화한다.
 */
export const initServiceWorkerRegistration = (registerSW: RegisterSW): void => {
  if (!("serviceWorker" in navigator)) return;

  registrationPromise = new Promise<ServiceWorkerRegistration | null>((resolve) => {
    registerSW({
      immediate: true,
      onRegisteredSW(_swScriptUrl, registration) {
        resolve(registration ?? null);
      },
      onRegisterError(error) {
        console.warn("registerSW 실패:", error);
        resolve(null);
      },
    });
  });
};

const waitUntilActive = async (registration: ServiceWorkerRegistration) => {
  if (registration.active) return registration;

  const worker = registration.installing ?? registration.waiting;
  if (!worker) {
    await withTimeout(navigator.serviceWorker.ready, ACTIVATION_WAIT_MS, "Service worker ready");
    return registration;
  }

  await withTimeout(
    new Promise<void>((resolve, reject) => {
      if (worker.state === "activated") {
        resolve();
        return;
      }

      worker.addEventListener("statechange", () => {
        if (worker.state === "activated") resolve();
        if (worker.state === "redundant") reject(new Error("Service worker became redundant"));
      });
    }),
    ACTIVATION_WAIT_MS,
    "Service worker activation",
  );

  return registration;
};

const pollRegistration = async (timeoutMs: number) => {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) return registration;
    await sleep(POLL_INTERVAL_MS);
  }

  return null;
};

const resolveRegistration = async (): Promise<ServiceWorkerRegistration> => {
  if (registrationPromise) {
    const fromRegisterSw = await registrationPromise;
    if (fromRegisterSw) return fromRegisterSw;
  }

  const polled = await pollRegistration(REGISTRATION_WAIT_MS);
  if (polled) return polled;

  const scriptAvailable = await isServiceWorkerScriptAvailable();
  if (!scriptAvailable) {
    throw new ServiceWorkerUnavailableError(import.meta.env.DEV ? getLocalDevHint() : "서비스 워커 파일을 불러올 수 없습니다.");
  }

  return navigator.serviceWorker.register(SERVICE_WORKER_URL);
};

/**
 * FCM getToken()에 필요한 active 서비스 워커 registration을 반환한다.
 */
export const ensureServiceWorkerReady = async (
  _mode: ServiceWorkerReadyMode = "quick",
): Promise<ServiceWorkerRegistration | null> => {
  if (!("serviceWorker" in navigator)) return null;

  if (cachedRegistration?.active) {
    return cachedRegistration;
  }

  try {
    let registration = await resolveRegistration();
    registration = await waitUntilActive(registration);

    if (!registration.active) {
      throw new ServiceWorkerUnavailableError("서비스 워커가 활성화되지 않았습니다.");
    }

    cachedRegistration = registration;
    return registration;
  } catch (error) {
    if (error instanceof ServiceWorkerUnavailableError) throw error;

    console.error("서비스 워커 준비 실패:", error);
    throw new ServiceWorkerUnavailableError(
      import.meta.env.DEV
        ? getLocalDevHint()
        : "서비스 워커가 등록되지 않았습니다. 앱을 완전히 종료한 뒤 다시 열어 주세요.",
    );
  }
};