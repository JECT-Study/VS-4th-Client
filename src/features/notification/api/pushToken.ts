import { defaultApi } from "@base/api/defaultApi";
import { FcmTokenError, getFcmToken, type GetFcmTokenOptions } from "@base/push/fcmToken";
import type { RegisterPushTokenRequestPlatformEnum } from "@ject-4-vs-team/api-client";

export type RegisterPushTokenOptions = GetFcmTokenOptions;

export const registerPushToken = async (
  platform: RegisterPushTokenRequestPlatformEnum,
  options: RegisterPushTokenOptions = {},
): Promise<void> => {
  const token = await getFcmToken(options);
  await defaultApi.register({ token, platform });
};

export const unregisterPushToken = async (): Promise<void> => {
  await defaultApi.unregisterAll();
};

export { FcmTokenError };