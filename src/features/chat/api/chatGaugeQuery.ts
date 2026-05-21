import { apiClient } from "@base/api/client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { ChatGaugeResponse, ChatTabType } from "../model/types";

// 1. API 호출 함수
export const getChatGauge = async (voteId: number) => {
  const { data } = await apiClient.get<ChatGaugeResponse>(`/api/chats/${voteId}/gauge`);
  return data;
};

// 2. Query Options
export const chatGaugeQueryKey = (voteId: number) => ["chat", voteId, "gauge"] as const;
export const chatGaugeQueryOptions = (voteId: number, status?: ChatTabType) =>
  queryOptions({
    queryKey: chatGaugeQueryKey(voteId),
    queryFn: () => getChatGauge(voteId),
    enabled: Number.isFinite(voteId),
    refetchInterval: status === "ONGOING" ? 5000 : false,
  });

// 3. React Query 훅
interface UseChatGaugeQueryParams {
  voteId: number;
  status?: ChatTabType;
}
export const useChatGaugeQuery = ({ voteId, status }: UseChatGaugeQueryParams) => {
  return useQuery(chatGaugeQueryOptions(voteId, status));
};
