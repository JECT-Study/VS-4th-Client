import { apiClient } from "@base/api/client";
import { queryOptions } from "@tanstack/react-query";

export type ActiveVoteSortType = "END_AT" | "LATEST" | "POPULAR";
export type ClosedVoteSortType = "LATEST" | "END_AT";

export interface ParticipatedVoteItem {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  localDate: string;
  endAt: string;
}

export interface ParticipatedVotesResponse {
  count: number;
  voteList: ParticipatedVoteItem[];
}

export interface ClosedParticipatedVotesResponse {
  count: number;
  voteList: ParticipatedVoteItem[];
}

export const activeParticipatedVotesQueryOptions = (sort: ActiveVoteSortType) =>
  queryOptions<ParticipatedVotesResponse>({
    queryKey: ["me", "participated-votes", "active", sort],
    queryFn: () =>
      apiClient
        .get<ParticipatedVotesResponse>("/api/votes/me/participated", { params: { type: sort } })
        .then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });

export const closedParticipatedVotesQueryOptions = (sort: ClosedVoteSortType) =>
  queryOptions<ClosedParticipatedVotesResponse>({
    queryKey: ["me", "participated-votes", "closed", sort],
    queryFn: () =>
      apiClient
        .get<ClosedParticipatedVotesResponse>("/api/votes/me/participated/end", { params: { type: sort } })
        .then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });
