import { RegisterPushTokenRequestPlatformEnum } from "@ject-4-vs-team/api-client";
import type { OSType } from "./useNotificationSetup";

export const resolvePushPlatform = (osType: OSType): RegisterPushTokenRequestPlatformEnum => {
  if (osType === "ios") {
    return RegisterPushTokenRequestPlatformEnum.Ios;
  }

  return RegisterPushTokenRequestPlatformEnum.Android;
};
