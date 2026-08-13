import { apiClient } from "@base/api/client";
import { queryOptions } from "@tanstack/react-query";
import type { ImmersiveFeedItem } from "../model/types";

export type ImmersiveVoteVariant = "A" | "B";

export interface ImmersiveFeedResponse {
  items: ImmersiveFeedItem[];
  variant?: ImmersiveVoteVariant;
}

export const immersiveFeedQueryKey = ["immersive-votes", "feed"] as const;

export const immersiveFeedQueryOptions = (startVoteId?: number) =>
  queryOptions<ImmersiveFeedResponse>({
    queryKey: startVoteId != null ? [...immersiveFeedQueryKey, startVoteId] : immersiveFeedQueryKey,
    queryFn: () =>
      apiClient
        .post<ImmersiveFeedResponse>("/api/immersive-votes/next", {
          excludeIds: [],
          size: 10,
          ...(startVoteId != null ? { startVoteId } : {}),
        })
        .then((r) => r.data),
    staleTime: 1000 * 60 * 2,
    refetchOnMount: "always",
  });

export const fetchNextImmersiveFeed = (excludeIds: number[]): Promise<ImmersiveFeedResponse> =>
  apiClient.post<ImmersiveFeedResponse>("/api/immersive-votes/next", { excludeIds, size: 10 }).then((r) => r.data);
