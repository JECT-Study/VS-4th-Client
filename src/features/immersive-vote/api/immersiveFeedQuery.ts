import { defaultApi } from "@base/api/defaultApi";
import { queryOptions } from "@tanstack/react-query";
import type { ImmersiveFeedItem } from "../model/types";

export interface ImmersiveFeedResponse {
  votes: ImmersiveFeedItem[];
  nextCursor: number | null;
  hasNext: boolean;
}

export const immersiveFeedQueryKey = ["immersive-votes", "feed"] as const;

export const immersiveFeedQueryOptions = (cursor?: number, startVoteId?: number) =>
  queryOptions<ImmersiveFeedResponse>({
    queryKey: startVoteId
      ? [...immersiveFeedQueryKey, "start", startVoteId]
      : cursor
        ? [...immersiveFeedQueryKey, cursor]
        : immersiveFeedQueryKey,
    queryFn: () =>
      defaultApi
        .getFeed(cursor, 10, startVoteId ? { params: { startVoteId } } : undefined)
        .then((r) => r.data as ImmersiveFeedResponse),
    staleTime: 1000 * 60 * 2,
  });
