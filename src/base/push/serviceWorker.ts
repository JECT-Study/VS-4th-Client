const SERVICE_WORKER_URL = "/sw.js";
const ACTIVATION_TIMEOUT_MS = 20_000;
const SW_RELOAD_FLAG = "vs:sw-reload-attempted";

let registrationPromise: Promise<ServiceWorkerRegistration | null> | null = null;

const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

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

const waitForWorkerState = (worker: ServiceWorker, targetState: ServiceWorkerState) =>
  new Promise<void>((resolve, reject) => {
    if (worker.state === targetState) {
      resolve();
      return;
    }

    const timeout = window.setTimeout(() => {
      reject(new Error(`Service worker did not reach "${targetState}" state`));
    }, ACTIVATION_TIMEOUT_MS);

    worker.addEventListener("statechange", () => {
      if (worker.state === targetState) {
        window.clearTimeout(timeout);
        resolve();
      }
    });
  });

const waitForServiceWorkerActivation = async (registration: ServiceWorkerRegistration) => {
  if (registration.active) return registration;

  requestSkipWaiting(registration);

  const worker = registration.installing ?? registration.waiting;
  if (worker) {
    await waitForWorkerState(worker, "activated");
    return registration;
  }

  await navigator.serviceWorker.ready;
  return registration;
};

const waitForControllingServiceWorker = async () => {
  if (navigator.serviceWorker.controller) return;

  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error("Service worker is not controlling the page"));
    }, ACTIVATION_TIMEOUT_MS);

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

/**
 * FCM 토큰 발급 전 서비스 워커가 등록·활성·페이지 제어 상태인지 보장한다.
 */
export const ensureServiceWorkerReady = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!("serviceWorker" in navigator)) return null;

  try {
    let registration = registrationPromise ? await registrationPromise : await navigator.serviceWorker.getRegistration();

    if (!registration) {
      registration = await navigator.serviceWorker.register(SERVICE_WORKER_URL);
    }

    registration = await waitForServiceWorkerActivation(registration);
    await navigator.serviceWorker.ready;

    try {
      await waitForControllingServiceWorker();
    } catch {
      if (reloadOnceForServiceWorker()) return null;
      throw new Error("Service worker is not controlling the page");
    }

    return registration;
  } catch (error) {
    console.error("서비스 워커 준비 실패:", error);

    for (let attempt = 0; attempt < 2; attempt += 1) {
      await sleep(500 * (attempt + 1));

      try {
        const registration = await navigator.serviceWorker.ready;
        await waitForControllingServiceWorker();
        return registration;
      } catch {
        // retry
      }
    }

    return null;
  }
};