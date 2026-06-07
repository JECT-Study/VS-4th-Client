import { initForegroundMessaging } from "@base/push/foregroundMessaging";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * 서비스워커 notificationclick → 앱 내 네비게이션 브리지.
 *
 * 알림 클릭 시:
 * A. 앱 창이 열려 있음 → SW가 postMessage로 URL 전달 → 이 컴포넌트가 navigate 수행
 * B. 앱 창이 닫혀 있음 → SW가 clients.openWindow(url) 직접 수행
 */
export function PushNotificationBridge() {
  const router = useRouter();

  useEffect(function initForegroundPushMessaging() {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    void initForegroundMessaging().then((cleanup) => {
      if (cancelled) {
        cleanup?.();
        return;
      }
      unsubscribe = cleanup;
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  useEffect(
    function listenForPushNavigation() {
      const sw = navigator.serviceWorker;
      if (!sw) return;

      function handleMessage(event: MessageEvent) {
        if (event.data?.type !== "PUSH_NOTIFICATION_CLICK") return;

        const url = event.data.url;
        if (typeof url !== "string") return;

        router.navigate({ href: url });
      }

      sw.addEventListener("message", handleMessage);
      return () => sw.removeEventListener("message", handleMessage);
    },
    [router],
  );

  return null;
}
