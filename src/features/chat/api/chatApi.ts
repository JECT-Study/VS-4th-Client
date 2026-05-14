import { apiClient } from "@/base/api/client";
import type {
  ChatGaugeResponse,
  ChatListResponse,
  ChatMessagesResponse,
  ChatMessageResponse,
  ChatRoomHeaderResponse,
  ChatTabType,
} from "../model/types";

export const getChats = async (status: ChatTabType) => {
  const { data } = await apiClient.get<ChatListResponse>("/api/chats", {
    params: {
      status,
    },
  });

  return data;
};

export const getChatRoomHeader = async (voteId: number) => {
  const { data } = await apiClient.get<ChatRoomHeaderResponse>(`/api/chats/${voteId}`);

  return data;
};

export const getChatGauge = async (voteId: number) => {
  const { data } = await apiClient.get<ChatGaugeResponse>(`/api/chats/${voteId}/gauge`);

  return data;
};

interface GetChatMessagesParams {
  voteId: number;
  cursor?: number;
  size?: number;
}

export const getChatMessages = async ({ voteId, cursor, size = 30 }: GetChatMessagesParams) => {
  const { data } = await apiClient.get<ChatMessagesResponse>(`/api/chats/${voteId}/messages`, {
    params: {
      cursor,
      size,
    },
  });

  return data;
};

export const sendChatMessage = async (voteId: number, content: string) => {
  const { data } = await apiClient.post<ChatMessageResponse>(`/api/chats/${voteId}/messages`, {
    content,
  });

  return data;
};

export const readChat = async (voteId: number, lastReadMessageId: number) => {
  await apiClient.post(`/api/chats/${voteId}/read`, {
    lastReadMessageId,
  });
};
