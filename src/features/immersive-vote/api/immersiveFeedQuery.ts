import { apiClient } from "@base/api/client";
import { queryOptions } from "@tanstack/react-query";
import type { ImmersiveFeedItem } from "../model/types";

export interface ImmersiveFeedResponse {
  items: ImmersiveFeedItem[];
}

export const immersiveFeedQueryKey = ["immersive-votes", "feed"] as const;

export const immersiveFeedQueryOptions = () =>
  queryOptions<ImmersiveFeedResponse>({
    queryKey: immersiveFeedQueryKey,
    queryFn: () =>
      apiClient
        .post<ImmersiveFeedResponse>("/api/immersive-votes/next", { excludeIds: [], size: 10 })
        .then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  });

export const fetchNextImmersiveFeed = (excludeIds: number[]): Promise<ImmersiveFeedResponse> =>
  apiClient
    .post<ImmersiveFeedResponse>("/api/immersive-votes/next", { excludeIds, size: 10 })
    .then((r) => r.data);
