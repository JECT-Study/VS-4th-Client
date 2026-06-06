const SW_READY_TIMEOUT_MS = 8_000;

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

/**
 * vite-plugin-pwa registerSW와 공유하는 등록 Promise를 초기화한다.
 */
export const initServiceWorkerRegistration = (registerSW: RegisterSW): void => {
  if (!("serviceWorker" in navigator)) return;

  registrationPromise = withTimeout(
    new Promise<ServiceWorkerRegistration | null>((resolve, reject) => {
      registerSW({
        immediate: true,
        onRegisteredSW(_swScriptUrl, registration) {
          if (registration) resolve(registration);
          else reject(new Error("Service worker registration is undefined"));
        },
        onRegisterError: reject,
      });
    }),
    SW_READY_TIMEOUT_MS,
    "Service worker registration",
  ).catch((error) => {
    console.warn("서비스 워커 등록 실패:", error);
    return null;
  });
};

const waitUntilActive = async (registration: ServiceWorkerRegistration) => {
  if (registration.active) return registration;

  const worker = registration.installing ?? registration.waiting;
  if (!worker) {
    return withTimeout(navigator.serviceWorker.ready, SW_READY_TIMEOUT_MS, "Service worker ready");
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
    SW_READY_TIMEOUT_MS,
    "Service worker activation",
  );

  return registration;
};

/**
 * FCM getToken()에 필요한 active 서비스 워커 registration을 반환한다.
 * registerSW가 등록한 워커만 사용하며, /sw.js 수동 등록은 하지 않는다.
 */
export const ensureServiceWorkerReady = async (
  _mode: ServiceWorkerReadyMode = "quick",
): Promise<ServiceWorkerRegistration | null> => {
  if (!("serviceWorker" in navigator)) return null;

  if (cachedRegistration?.active) {
    return cachedRegistration;
  }

  try {
    let registration: ServiceWorkerRegistration | null = null;

    if (registrationPromise) {
      registration = await registrationPromise;
    }

    if (!registration) {
      registration = (await navigator.serviceWorker.getRegistration()) ?? null;
    }

    if (!registration) {
      throw new ServiceWorkerUnavailableError(
        import.meta.env.DEV ? getLocalDevHint() : "서비스 워커가 등록되지 않았습니다. 앱을 다시 열어 주세요.",
      );
    }

    registration = await waitUntilActive(registration);

    if (!registration.active) {
      throw new ServiceWorkerUnavailableError("서비스 워커가 활성화되지 않았습니다.");
    }

    cachedRegistration = registration;
    return registration;
  } catch (error) {
    if (error instanceof ServiceWorkerUnavailableError) throw error;

    const message = import.meta.env.DEV
      ? getLocalDevHint()
      : "서비스 워커 준비에 실패했습니다. 앱을 완전히 종료한 뒤 다시 열어 주세요.";

    throw new ServiceWorkerUnavailableError(message);
  }
};