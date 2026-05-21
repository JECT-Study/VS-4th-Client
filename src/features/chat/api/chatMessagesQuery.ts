import { apiClient } from "@base/api/client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { ChatMessagesResponse } from "../model/types";

// 1. API 호출 함수
interface GetChatMessagesParams {
  voteId: number;
  cursor?: number;
  size?: number;
}
export const getChatMessages = async ({ voteId, cursor, size = 30 }: GetChatMessagesParams) => {
  const { data } = await apiClient.get<ChatMessagesResponse>(`/api/chats/${voteId}/messages`, {
    params: { cursor, size },
  });
  return data;
};

// 2. Query Options
export const chatMessagesQueryKey = (voteId: number) => ["chat", voteId, "messages"] as const;
export const chatMessagesQueryOptions = (voteId: number) =>
  queryOptions({
    queryKey: chatMessagesQueryKey(voteId),
    queryFn: () => getChatMessages({ voteId, size: 30 }),
    enabled: Number.isFinite(voteId),
  });

// 3. React Query 훅
export const useChatMessagesQuery = (voteId: number) => {
  return useQuery(chatMessagesQueryOptions(voteId));
};
