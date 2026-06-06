import { defaultApi } from "@base/api/defaultApi";
import { FcmTokenError, type GetFcmTokenOptions, getFcmToken } from "@base/push/fcmToken";
import { isDesktopBrowser } from "@features/notification/model/isDesktopBrowser";
import type { RegisterPushTokenRequestPlatformEnum } from "@ject-4-vs-team/api-client";

export type RegisterPushTokenOptions = GetFcmTokenOptions;

type RegisteredTokenSnapshot = {
  token: string;
  platform: RegisterPushTokenRequestPlatformEnum;
};

let registerPushTokenPromise: Promise<void> | null = null;
let registeredTokenSnapshot: RegisteredTokenSnapshot | null = null;

const debugPush = (message: string, detail?: unknown) => {
  if (!import.meta.env.DEV) return;
  if (detail === undefined) {
    console.debug(`[push] ${message}`);
    return;
  }
  console.debug(`[push] ${message}`, detail);
};

export const registerPushToken = async (
  platform: RegisterPushTokenRequestPlatformEnum,
  options: RegisterPushTokenOptions = {},
): Promise<void> => {
  if (isDesktopBrowser()) {
    throw new FcmTokenError("푸시 알림은 모바일 앱에서만 설정할 수 있어요.", "UNSUPPORTED");
  }

  if (registerPushTokenPromise) {
    debugPush("api register deduped", { platform });
    return registerPushTokenPromise;
  }

  registerPushTokenPromise = (async () => {
    debugPush("fcm token start", { platform });
    const token = await getFcmToken(options);
    debugPush("fcm token success", { platform, tokenLength: token.length });

    if (registeredTokenSnapshot?.token === token && registeredTokenSnapshot.platform === platform) {
      debugPush("api register skipped: token already synced", { platform });
      return;
    }

    debugPush("api register start", { platform, url: "/api/devices/push-token" });
    await defaultApi.register({ token, platform });
    registeredTokenSnapshot = { token, platform };
    debugPush("api register success", { platform });
  })();

  try {
    await registerPushTokenPromise;
  } finally {
    registerPushTokenPromise = null;
  }
};

export const unregisterPushToken = async (): Promise<void> => {
  debugPush("api unregister start", { url: "/api/devices/push-token" });
  await defaultApi.unregisterAll();
  registeredTokenSnapshot = null;
  debugPush("api unregister success");
};

export { FcmTokenError };
