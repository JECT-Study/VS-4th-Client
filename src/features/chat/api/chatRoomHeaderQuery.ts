import { apiClient } from "@base/api/client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { ChatRoomHeaderResponse } from "../model/types";

// 1. API 호출 함수
export const getChatRoomHeader = async (voteId: number) => {
  const { data } = await apiClient.get<ChatRoomHeaderResponse>(`/api/chats/${voteId}`);
  return data;
};

// 2. Query Options
export const chatRoomHeaderQueryKey = (voteId: number) => ["chat", voteId, "header"] as const;
export const chatRoomHeaderQueryOptions = (voteId: number) =>
  queryOptions({
    queryKey: chatRoomHeaderQueryKey(voteId),
    queryFn: () => getChatRoomHeader(voteId),
    enabled: Number.isFinite(voteId),
  });

// 3. React Query 훅
export const useChatRoomHeaderQuery = (voteId: number) => {
  return useQuery(chatRoomHeaderQueryOptions(voteId));
};
