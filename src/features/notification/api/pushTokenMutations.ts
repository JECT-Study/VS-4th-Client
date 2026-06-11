import type { RegisterPushTokenRequestPlatformEnum } from "@ject-4-vs-team/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationSettingQueryKey } from "./notificationSetting";
import { registerPushToken, unregisterPushToken } from "./pushToken";

export const useRegisterPushTokenMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (platform: RegisterPushTokenRequestPlatformEnum) =>
      registerPushToken(platform, { mode: "interactive" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationSettingQueryKey }),
  });
};

export const useUnregisterPushTokenMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unregisterPushToken,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationSettingQueryKey }),
  });
};
