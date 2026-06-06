import { getFirebaseApp } from "@base/push/firebaseConfig";
import {
  type FcmMessagePayload,
  normalizePushNotification,
} from "@base/push/fcmNotificationPayload";
import { getMessaging, isSupported, onMessage } from "firebase/messaging";

const showForegroundNotification = async (payload: FcmMessagePayload) => {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  if (!navigator.serviceWorker) return;

  const notification = normalizePushNotification(payload);
  const registration = await navigator.serviceWorker.ready;

  await registration.showNotification(notification.title, {
    body: notification.body,
    icon: notification.icon,
    badge: notification.badge,
    tag: notification.tag,
    data: { redirect_url: notification.redirectUrl },
  });
};

export const initForegroundMessaging = async (): Promise<(() => void) | undefined> => {
  if (!(await isSupported())) return;
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const messaging = getMessaging(getFirebaseApp());

  return onMessage(messaging, (payload) => {
    void showForegroundNotification(payload as FcmMessagePayload);
  });
};