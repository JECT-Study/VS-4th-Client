import { apiClient } from "@base/api/client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { ChatListResponse, ChatTabType } from "../model/types";

// 1. API 호출 함수
export const getChats = async (status: ChatTabType) => {
    const { data } = await apiClient.get<ChatListResponse>("/api/chats", { params: { status } });
    return data;
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