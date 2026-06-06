const SERVICE_WORKER_URL = "/sw.js";

export const ensureServiceWorkerReady = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!("serviceWorker" in navigator)) return null;

  const existing = await navigator.serviceWorker.getRegistration();
  if (existing?.active) {
    return existing;
  }

  try {
    await navigator.serviceWorker.register(SERVICE_WORKER_URL, { type: "module" });
  } catch (error) {
    console.error("서비스 워커 등록 실패:", error);
    return null;
  }

  return navigator.serviceWorker.ready;
};
