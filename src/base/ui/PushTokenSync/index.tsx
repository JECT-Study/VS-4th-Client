import { getFcmToken } from "@base/push/fcmToken";
import { userQueryOptions } from "@features/auth/api/userQuery";
import { registerPushToken } from "@features/notification/api/pushToken";
import { resolvePushPlatform } from "@features/notification/model/resolvePushPlatform";
import type { OSType } from "@features/notification/model/useNotificationSetup";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const detectOsType = (): OSType => {
  const userAgent = window.navigator.userAgent.toLowerCase();

  if (/android/i.test(userAgent)) {
    return "android";
  }

  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return "Notification" in window ? "ios" : "ios-outdated";
  }

  return "other";
};

/**
 * 로그인 상태에서 알림 권한이 이미 허용된 경우 FCM 토큰을 서버에 동기화한다.
 */
export function PushTokenSync() {
  const { data: user } = useQuery(userQueryOptions());

  useEffect(() => {
    if (!user) return;
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    let cancelled = false;

    const syncToken = async () => {
      const token = await getFcmToken();
      if (!token || cancelled) return;

      try {
        await registerPushToken(resolvePushPlatform(detectOsType()));
      } catch (error) {
        console.error("푸시 토큰 동기화 실패:", error);
      }
    };

    void syncToken();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return null;
}
