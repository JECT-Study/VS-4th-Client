import { defaultApi } from "@base/api/defaultApi";
import type { QueryClient } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationListQueryKey, notificationUnreadCountQueryKey } from "./notificationQueries";

const invalidateNotifications = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: notificationListQueryKey });
  queryClient.invalidateQueries({ queryKey: notificationUnreadCountQueryKey });
};

export const useReadNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) => defaultApi.markAsRead(notificationId),
    onSuccess: () => invalidateNotifications(queryClient),
  });
};

export const useReadAllNotificationsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => defaultApi.markAllAsRead(),
    onSuccess: () => invalidateNotifications(queryClient),
  });
};
