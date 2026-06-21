import { apiClient } from "@base/api/client";

export interface NotificationPromptStatus {
  shouldShow: boolean;
  totalParticipationCount: number;
}

export const getNotificationPromptStatus = async (): Promise<NotificationPromptStatus> => {
  const { data } = await apiClient.get<NotificationPromptStatus>("/api/me/notification-prompt/status");
  return data;
};

export const dismissNotificationPrompt = async (): Promise<void> => {
  await apiClient.post("/api/me/notification-prompt/dismissed");
};
