import { apiClient } from "@base/api/client";
import { queryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
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

// 2. Query Keys
export const chatMessagesQueryKey = (voteId: number) => ["chat", voteId, "messages"] as const;
export const chatInfiniteMessagesQueryKey = (voteId: number) => ["chat", voteId, "messages", "infinite"] as const;

// 3. Query Options (ChatRoomPage용 단일 조회)
export const chatMessagesQueryOptions = (voteId: number) =>
  queryOptions({
    queryKey: chatMessagesQueryKey(voteId),
    queryFn: () => getChatMessages({ voteId, size: 30 }),
    enabled: Number.isFinite(voteId),
  });

// 4. React Query 훅 (ChatRoomPage)
export const useChatMessagesQuery = (voteId: number) => {
  return useQuery(chatMessagesQueryOptions(voteId));
};

// 5. Infinite Query 훅 (ChatBottomSheet 무한 스크롤)
export const useInfiniteChatMessagesQuery = (voteId: number) => {
  return useInfiniteQuery({
    queryKey: chatInfiniteMessagesQueryKey(voteId),
    queryFn: ({ pageParam }) => getChatMessages({ voteId, cursor: pageParam, size: 30 }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
    enabled: Number.isFinite(voteId),
  });
};
