import { defaultApi } from "@base/api/defaultApi";
import { FcmTokenError, getFcmToken } from "@base/push/fcmToken";
import type { RegisterPushTokenRequestPlatformEnum } from "@ject-4-vs-team/api-client";

export const registerPushToken = async (platform: RegisterPushTokenRequestPlatformEnum): Promise<void> => {
  const token = await getFcmToken();
  await defaultApi.register({ token, platform });
};

export const unregisterPushToken = async (): Promise<void> => {
  await defaultApi.unregisterAll();
};

export { FcmTokenError };
