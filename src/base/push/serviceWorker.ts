const SERVICE_WORKER_URL = "/sw.js";
const REGISTRATION_TIMEOUT_MS = 5_000;
const QUICK_TIMEOUT_MS = 3_000;
const INTERACTIVE_TIMEOUT_MS = 15_000;

let registrationPromise: Promise<ServiceWorkerRegistration | null> | null = null;
let cachedRegistration: ServiceWorkerRegistration | null = null;
let inflightReady: Promise<ServiceWorkerRegistration | null> | null = null;

const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export type ServiceWorkerReadyMode = "quick" | "interactive";

type RegisterSW = (options?: {
  immediate?: boolean;
  onRegisteredSW?: (swScriptUrl: string, registration: ServiceWorkerRegistration | undefined) => void;
  onRegisterError?: (error: unknown) => void;
}) => (reloadPage?: boolean) => Promise<void>;

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> => {
  let timeoutId: number | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => {
      reject(new Error(`${label} timeout`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  }
};

const getRegistration = async (): Promise<ServiceWorkerRegistration | null> => {
  if (registrationPromise) {
    try {
      const registration = await withTimeout(registrationPromise, REGISTRATION_TIMEOUT_MS, "Service worker registration");
      if (registration) return registration;
    } catch (error) {
      console.warn("서비스 워커 등록 대기 실패, 직접 조회합니다:", error);
    }
  }

  return (await navigator.serviceWorker.getRegistration()) ?? null;
};

/**
 * vite-plugin-pwa registerSW와 공유하는 등록 Promise를 초기화한다.
 */
export const initServiceWorkerRegistration = (registerSW: RegisterSW): void => {
  if (!("serviceWorker" in navigator)) return;

  registrationPromise = new Promise<ServiceWorkerRegistration | null>((resolve, reject) => {
    registerSW({
      immediate: true,
      onRegisteredSW(_swScriptUrl, registration) {
        resolve(registration ?? null);
      },
      onRegisterError(error) {
        reject(error);
      },
    });
  }).catch((error) => {
    console.error("서비스 워커 등록 실패:", error);
    return null;
  });
};

const requestSkipWaiting = (registration: ServiceWorkerRegistration) => {
  registration.waiting?.postMessage({ type: "SKIP_WAITING" });
};

const waitForWorkerState = (worker: ServiceWorker, targetState: ServiceWorkerState, timeoutMs: number) =>
  new Promise<void>((resolve, reject) => {
    if (worker.state === targetState) {
      resolve();
      return;
    }

    const timeout = window.setTimeout(() => {
      reject(new Error(`Service worker did not reach "${targetState}" state`));
    }, timeoutMs);

    worker.addEventListener("statechange", () => {
      if (worker.state === targetState) {
        window.clearTimeout(timeout);
        resolve();
      }
    });
  });

const waitForActiveServiceWorker = async (registration: ServiceWorkerRegistration, timeoutMs: number) => {
  if (registration.active) return registration;

  requestSkipWaiting(registration);

  const worker = registration.installing ?? registration.waiting;
  if (worker) {
    await waitForWorkerState(worker, "activated", timeoutMs);
    return registration;
  }

  await navigator.serviceWorker.ready;
  return registration;
};

const resolveReadyRegistration = async (mode: ServiceWorkerReadyMode): Promise<ServiceWorkerRegistration | null> => {
  if (!("serviceWorker" in navigator)) return null;

  const timeoutMs = mode === "interactive" ? INTERACTIVE_TIMEOUT_MS : QUICK_TIMEOUT_MS;

  let registration = await getRegistration();

  if (!registration) {
    registration = await navigator.serviceWorker.register(SERVICE_WORKER_URL);
  }

  registration = await waitForActiveServiceWorker(registration, timeoutMs);
  await navigator.serviceWorker.ready;

  if (!registration.active) {
    throw new Error("Service worker is not active");
  }

  cachedRegistration = registration;
  return registration;
};

/**
 * FCM getToken()에 필요한 active 서비스 워커 registration을 반환한다.
 * 페이지 controlling 여부는 FCM 토큰 발급에 필수가 아니다.
 */
export const ensureServiceWorkerReady = async (
  mode: ServiceWorkerReadyMode = "quick",
): Promise<ServiceWorkerRegistration | null> => {
  if (!("serviceWorker" in navigator)) return null;

  if (cachedRegistration?.active) {
    return cachedRegistration;
  }

  if (inflightReady) {
    return inflightReady;
  }

  inflightReady = (async () => {
    try {
      return await resolveReadyRegistration(mode);
    } catch (error) {
      if (mode === "quick") {
        console.warn("서비스 워커 빠른 준비 실패:", error);
        return null;
      }

      console.error("서비스 워커 준비 실패:", error);

      for (let attempt = 0; attempt < 2; attempt += 1) {
        await sleep(500 * (attempt + 1));

        try {
          const registration = await navigator.serviceWorker.ready;
          if (registration.active) {
            cachedRegistration = registration;
            return registration;
          }
        } catch {
          // retry
        }
      }

      return null;
    } finally {
      inflightReady = null;
    }
  })();

  return inflightReady;
};