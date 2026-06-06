import { defaultApi } from "@base/api/defaultApi";
import { getFcmToken } from "@base/push/fcmToken";
import type { RegisterPushTokenRequestPlatformEnum } from "@ject-4-vs-team/api-client";

export const registerPushToken = async (platform: RegisterPushTokenRequestPlatformEnum): Promise<void> => {
  const token = await getFcmToken();
  if (!token) {
    throw new Error("FCM_TOKEN_UNAVAILABLE");
  }

  await defaultApi.register({ token, platform });
};

export const unregisterPushToken = async (): Promise<void> => {
  await defaultApi.unregisterAll();
};
