import { apiClient } from "@base/api/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { HomeVotesResponse, VoteSortType } from "../model/home.ts";

const getHomeVotes = async (sort: VoteSortType, excludeEnded: boolean, cursor?: string) => {
  const { data } = await apiClient.get<HomeVotesResponse>("/api/home/votes", {
    params: { sort, excludeEnded, cursor, size: 10 },
  });
  return data;
};

export const homeVotesQueryKey = (sort: VoteSortType, excludeEnded: boolean) =>
  ["home", "votes", { sort, excludeEnded }] as const;

export const useHomeVotesQuery = (sort: VoteSortType, excludeEnded: boolean) =>
  useInfiniteQuery({
    queryKey: homeVotesQueryKey(sort, excludeEnded),
    queryFn: ({ pageParam }) => getHomeVotes(sort, excludeEnded, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
  });
