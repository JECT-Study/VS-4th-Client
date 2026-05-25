import { defaultApi } from "@base/api/defaultApi";
import { queryOptions } from "@tanstack/react-query";

export interface FreeVotesResponse {
  remainingFreeVotes: number;
  totalFreeVotes: number;
}

export const freeVotesQueryKey = ["me", "free-votes"] as const;

export const freeVotesQueryOptions = () =>
  queryOptions<FreeVotesResponse>({
    queryKey: freeVotesQueryKey,
    queryFn: () => defaultApi.getFreeVotes().then((r) => r.data as FreeVotesResponse),
    staleTime: 1000 * 60 * 5,
  });
