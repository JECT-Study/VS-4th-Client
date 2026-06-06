import { getFirebaseApp, getFirebaseVapidKey } from "@base/push/firebaseConfig";
import { ensureServiceWorkerReady } from "@base/push/serviceWorker";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

export const getFcmToken = async (): Promise<string | null> => {
  const app = getFirebaseApp();
  const vapidKey = getFirebaseVapidKey();

  if (!app || !vapidKey) {
    console.warn("Firebase 푸시 설정이 없어 FCM 토큰을 발급할 수 없습니다.");
    return null;
  }

  if (!(await isSupported())) {
    console.warn("이 브라우저는 Firebase Cloud Messaging을 지원하지 않습니다.");
    return null;
  }

  const registration = await ensureServiceWorkerReady();
  if (!registration) {
    console.warn("서비스 워커가 준비되지 않아 FCM 토큰을 발급할 수 없습니다.");
    return null;
  }

  try {
    const messaging = getMessaging(app);
    return await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });
  } catch (error) {
    console.error("FCM 토큰 발급 실패:", error);
    return null;
  }
};
