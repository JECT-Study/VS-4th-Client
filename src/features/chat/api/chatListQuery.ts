import { apiClient } from "@base/api/client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { ChatListResponse, ChatTabType } from "../model/types";

const getTime = (date: string | undefined) => {
  if (!date) return 0;
  const time = new Date(date).getTime();
  return Number.isNaN(time) ? 0 : time;
};

export const sortChatListItems = (chats: ChatListResponse["chats"]) =>
  [...chats].sort((a, b) => {
    const lastMessageDiff = getTime(b.lastMessageAt) - getTime(a.lastMessageAt);
    if (lastMessageDiff !== 0) return lastMessageDiff;

    return getTime(b.createdAt) - getTime(a.createdAt);
  });

export const resetChatUnreadCount = (
  data: ChatListResponse | undefined,
  voteId: number,
): ChatListResponse | undefined => {
  if (!data) return data;

  return {
    ...data,
    chats: data.chats.map((chat) => (chat.voteId === voteId ? { ...chat, unreadCount: 0 } : chat)),
  };
};

// 1. API 호출 함수
export const getChats = async (status: ChatTabType) => {
  const { data } = await apiClient.get<ChatListResponse>("/api/chats", { params: { status } });
  return {
    ...data,
    chats: sortChatListItems(data.chats ?? []),
  };
};

// 2. Query Options
export const chatListQueryKey = (status: ChatTabType) => ["chats", status] as const;
export const chatListQueryOptions = (status: ChatTabType) =>
  queryOptions({
    queryKey: chatListQueryKey(status),
    queryFn: () => getChats(status),
  });

// 3. React Query 훅
export const useChatListQuery = (status: ChatTabType) => {
  return useQuery(chatListQueryOptions(status));
};
