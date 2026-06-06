const SERVICE_WORKER_URL = "/sw.js";
const QUICK_TIMEOUT_MS = 2_000;
const INTERACTIVE_TIMEOUT_MS = 8_000;
const SW_RELOAD_FLAG = "vs:sw-reload-attempted";

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

const waitForServiceWorkerActivation = async (registration: ServiceWorkerRegistration, timeoutMs: number) => {
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

const waitForControllingServiceWorker = async (timeoutMs: number) => {
  if (navigator.serviceWorker.controller) return;

  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error("Service worker is not controlling the page"));
    }, timeoutMs);

    const finish = () => {
      if (!navigator.serviceWorker.controller) return;
      window.clearTimeout(timeout);
      resolve();
    };

    if (navigator.serviceWorker.controller) {
      finish();
      return;
    }

    navigator.serviceWorker.addEventListener("controllerchange", finish, { once: true });
  });
};

const reloadOnceForServiceWorker = (): boolean => {
  if (sessionStorage.getItem(SW_RELOAD_FLAG) === "1") return false;

  sessionStorage.setItem(SW_RELOAD_FLAG, "1");
  window.location.reload();
  return true;
};

const resolveReadyRegistration = async (mode: ServiceWorkerReadyMode): Promise<ServiceWorkerRegistration | null> => {
  if (!("serviceWorker" in navigator)) return null;

  const timeoutMs = mode === "interactive" ? INTERACTIVE_TIMEOUT_MS : QUICK_TIMEOUT_MS;
  const allowReload = mode === "interactive";

  let registration = registrationPromise ? await registrationPromise : await navigator.serviceWorker.getRegistration();

  if (!registration) {
    registration = await navigator.serviceWorker.register(SERVICE_WORKER_URL);
  }

  registration = await waitForServiceWorkerActivation(registration, timeoutMs);
  await navigator.serviceWorker.ready;

  try {
    await waitForControllingServiceWorker(timeoutMs);
  } catch {
    if (allowReload && reloadOnceForServiceWorker()) return null;
    throw new Error("Service worker is not controlling the page");
  }

  cachedRegistration = registration;
  return registration;
};

/**
 * FCM 토큰 발급 전 서비스 워커 준비 상태를 확인한다.
 * - quick: 앱 시작 동기화용. 짧은 대기, 자동 새로고침 없음.
 * - interactive: 사용자가 푸시 ON 할 때. 조금 더 기다리고 1회 자동 새로고침 허용.
 */
export const ensureServiceWorkerReady = async (
  mode: ServiceWorkerReadyMode = "quick",
): Promise<ServiceWorkerRegistration | null> => {
  if (!("serviceWorker" in navigator)) return null;

  if (cachedRegistration?.active && navigator.serviceWorker.controller) {
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
        await sleep(400 * (attempt + 1));

        try {
          const registration = await navigator.serviceWorker.ready;
          await waitForControllingServiceWorker(INTERACTIVE_TIMEOUT_MS);
          cachedRegistration = registration;
          return registration;
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