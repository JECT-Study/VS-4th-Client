import { userQueryOptions } from "@features/auth/api/userQuery";
import { registerPushToken } from "@features/notification/api/pushToken";
import { resolvePushPlatform } from "@features/notification/model/resolvePushPlatform";
import type { OSType } from "@features/notification/model/useNotificationSetup";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const SYNC_DELAY_MS = 5_000;

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
 * 앱 첫 로딩을 막지 않도록 지연·백그라운드로 실행한다.
 */
export function PushTokenSync() {
  const { data: user } = useQuery(userQueryOptions());

  useEffect(() => {
    if (!user) return;
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller) return;

    let cancelled = false;

    const syncToken = async () => {
      if (cancelled) return;

      try {
        await registerPushToken(resolvePushPlatform(detectOsType()), { mode: "quick" });
      } catch (error) {
        console.warn("푸시 토큰 백그라운드 동기화 생략:", error);
      }
    };

    const timer = window.setTimeout(() => {
      void syncToken();
    }, SYNC_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [user]);

  return null;
}