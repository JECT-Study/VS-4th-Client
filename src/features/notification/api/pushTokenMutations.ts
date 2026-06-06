import type { RegisterPushTokenRequestPlatformEnum } from "@ject-4-vs-team/api-client";
import { useMutation } from "@tanstack/react-query";
import { registerPushToken, unregisterPushToken } from "./pushToken";

export const useRegisterPushTokenMutation = () =>
  useMutation({
    mutationFn: (platform: RegisterPushTokenRequestPlatformEnum) => registerPushToken(platform),
  });

export const useUnregisterPushTokenMutation = () =>
  useMutation({
    mutationFn: unregisterPushToken,
  });
