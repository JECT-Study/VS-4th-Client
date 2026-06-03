import { defaultApi } from "@base/api/defaultApi";
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

async function filterParticipatedVotes<T extends ParticipatedVotesResponse | ClosedParticipatedVotesResponse>(
  response: T,
  isExpectedStatus: (status: string | undefined) => boolean,
): Promise<T> {
  const sourceVoteList = response.voteList ?? [];
  const checkedVotes = await Promise.all(
    sourceVoteList.map(async (vote) => {
      const { data } = await defaultApi.getDetail(vote.id);
      return data.myVote?.voted === true && isExpectedStatus(data.status) ? vote : null;
    }),
  );

  const voteList = checkedVotes.filter((vote): vote is ParticipatedVoteItem => vote !== null);

  return {
    ...response,
    count: voteList.length,
    voteList,
  };
}

function sortActiveVoteList(voteList: ParticipatedVoteItem[], sort: ActiveVoteSortType): ParticipatedVoteItem[] {
  const sortedVoteList = [...voteList];

  if (sort === "LATEST") {
    return sortedVoteList.sort((a, b) => new Date(b.localDate).getTime() - new Date(a.localDate).getTime());
  }

  if (sort === "END_AT") {
    return sortedVoteList.sort((a, b) => new Date(a.endAt).getTime() - new Date(b.endAt).getTime());
  }

  return sortedVoteList;
}

export const getActiveParticipatedVotes = async (sort: ActiveVoteSortType): Promise<ParticipatedVotesResponse> => {
  const { data } = await defaultApi.getVoteListParticipated(sort);
  let response = await filterParticipatedVotes(data as ParticipatedVotesResponse, (status) => status !== "ENDED");

  if (response.voteList.length === 0 && sort !== "POPULAR") {
    const fallback = await defaultApi.getVoteListParticipated("POPULAR");
    response = await filterParticipatedVotes(
      fallback.data as ParticipatedVotesResponse,
      (status) => status !== "ENDED",
    );
  }

  const voteList = sortActiveVoteList(response.voteList, sort);

  return {
    ...response,
    count: voteList.length,
    voteList,
  };
};

export const getClosedParticipatedVotes = (sort: ClosedVoteSortType): Promise<ClosedParticipatedVotesResponse> =>
  defaultApi
    .getVoteListEndParticipated(sort)
    .then((r) => r.data as ClosedParticipatedVotesResponse)
    .then((response) => filterParticipatedVotes(response, (status) => status === "ENDED"));

export const activeParticipatedVotesQueryOptions = (sort: ActiveVoteSortType) =>
  queryOptions<ParticipatedVotesResponse>({
    queryKey: ["me", "participated-votes", "active", sort],
    queryFn: () => getActiveParticipatedVotes(sort),
    staleTime: 1000 * 60 * 5,
  });

export const closedParticipatedVotesQueryOptions = (sort: ClosedVoteSortType) =>
  queryOptions<ClosedParticipatedVotesResponse>({
    queryKey: ["me", "participated-votes", "closed", sort],
    queryFn: () => getClosedParticipatedVotes(sort),
    staleTime: 1000 * 60 * 5,
  });
