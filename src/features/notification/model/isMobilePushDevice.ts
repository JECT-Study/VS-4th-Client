import type { OSType } from "./useNotificationSetup";

export const detectOsTypeFromUserAgent = (): OSType => {
  const userAgent = window.navigator.userAgent.toLowerCase();

  if (/android/i.test(userAgent)) {
    return "android";
  }

  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return "Notification" in window ? "ios" : "ios-outdated";
  }

  return "other";
};

export const isMobilePushDevice = (osType: OSType = detectOsTypeFromUserAgent()): boolean =>
  osType === "android" || osType === "ios";