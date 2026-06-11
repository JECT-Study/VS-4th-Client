import { apiClient } from "@base/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface NotificationSetting {
  pushEnabled: boolean;
  pushEnabledAt?: string | null;
  pushDisabledAt?: string | null;
}

export const notificationSettingQueryKey = ["notifications", "setting"] as const;

export const getNotificationSetting = async (): Promise<NotificationSetting> => {
  const { data } = await apiClient.get<NotificationSetting>("/api/me/notification-setting");
  return data;
};

export const updateNotificationSetting = async (pushEnabled: boolean): Promise<NotificationSetting> => {
  const { data } = await apiClient.put<NotificationSetting>("/api/me/notification-setting", { pushEnabled });
  return data;
};

export const useNotificationSettingQuery = () =>
  useQuery({
    queryKey: notificationSettingQueryKey,
    queryFn: getNotificationSetting,
  });

export const useUpdateNotificationSettingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNotificationSetting,
    onSuccess: (setting) => {
      queryClient.setQueryData(notificationSettingQueryKey, setting);
    },
  });
};
