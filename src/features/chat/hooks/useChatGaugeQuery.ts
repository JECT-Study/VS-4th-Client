import { useQuery } from "@tanstack/react-query";
import { getChatGauge } from "../api/chatApi";
import type { ChatTabType } from "../model/types";

interface UseChatGaugeQueryParams {
  voteId: number;
  status?: ChatTabType;
}

export const useChatGaugeQuery = ({ voteId, status }: UseChatGaugeQueryParams) => {
  return useQuery({
    queryKey: ["chat", voteId, "gauge"],
    queryFn: () => getChatGauge(voteId),
    enabled: Number.isFinite(voteId),
    refetchInterval: status === "ONGOING" ? 5000 : false,
  });
};
