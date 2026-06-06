import type { OSType } from "./useNotificationSetup";

export const detectOsTypeFromUserAgent = (): OSType => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/android/i.test(userAgent)) {
    return "android";
  }

  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return "Notification" in window ? "ios" : "ios-outdated";
  }

  return "other";
};

/** 데스크탑 브라우저(모바일 UA 아님) */
export const isDesktopBrowser = (): boolean => detectOsTypeFromUserAgent() === "other";