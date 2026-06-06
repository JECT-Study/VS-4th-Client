import { apiClient } from "@base/api/client";
import { FcmTokenError, type GetFcmTokenOptions, getFcmToken } from "@base/push/fcmToken";
import type { RegisterPushTokenRequestPlatformEnum } from "@ject-4-vs-team/api-client";

export type RegisterPushTokenOptions = GetFcmTokenOptions;

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
  debugPush("fcm token start", { platform });
  const token = await getFcmToken(options);
  debugPush("fcm token success", { platform, tokenLength: token.length });

  debugPush("api register start", { platform, url: "/api/devices/push-token" });
  await apiClient.post("/api/devices/push-token", { token, platform });
  debugPush("api register success", { platform });
};

export const unregisterPushToken = async (): Promise<void> => {
  debugPush("api unregister start", { url: "/api/devices/push-token" });
  await apiClient.delete("/api/devices/push-token");
  debugPush("api unregister success");
};

export { FcmTokenError };
