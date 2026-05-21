import { apiClient } from "@base/api/client";
import { queryOptions } from "@tanstack/react-query";
import type { ImmersiveFeedItem } from "../model/types";

export interface ImmersiveFeedResponse {
  votes: ImmersiveFeedItem[];
  nextCursor: number | null;
  hasNext: boolean;
}

export const immersiveFeedQueryKey = ["immersive-votes", "feed"] as const;

export const immersiveFeedQueryOptions = (cursor?: number) =>
  queryOptions<ImmersiveFeedResponse>({
    queryKey: cursor ? [...immersiveFeedQueryKey, cursor] : immersiveFeedQueryKey,
    queryFn: () =>
      apiClient
        .get<ImmersiveFeedResponse>("/api/immersive-votes", {
          params: { ...(cursor ? { cursor } : {}), size: 10 },
        })
        .then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  });
