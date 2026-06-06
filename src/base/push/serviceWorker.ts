const SERVICE_WORKER_URL = "/sw.js";

/**
 * vite-plugin-pwa의 registerSW가 classic 타입으로 /sw.js를 등록한다.
 * module 타입으로 재등록하면 프로덕션 빌드와 충돌해 FCM 토큰 발급이 실패한다.
 */
export const ensureServiceWorkerReady = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!("serviceWorker" in navigator)) return null;

  try {
    const existing = await navigator.serviceWorker.getRegistration();
    if (!existing) {
      await navigator.serviceWorker.register(SERVICE_WORKER_URL);
    }

    return await navigator.serviceWorker.ready;
  } catch (error) {
    console.error("서비스 워커 준비 실패:", error);
    return null;
  }
};
