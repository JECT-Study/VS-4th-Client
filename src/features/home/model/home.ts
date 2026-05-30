export type VoteStatus = "ONGOING" | "ENDED";

export type VoteSortType = "LATEST" | "POPULAR" | "ENDING_SOON";

export interface VoteItem {
  voteId: number;
  thumbnailUrl: string;
  status: VoteStatus;
  title: string;
  content: string;
  endAt: string;
}

export interface RecommendationItem {
  voteId: number;
  thumbnailUrl: string;
  title: string;
  content: string;
  endAt: string;
}

export interface HotTopicItem {
  rank: number;
  voteId: number;
  thumbnailUrl: string;
  title: string;
  content: string;
  participantCount: number;
  endAt: string;
}

export interface HomeVotesResponse {
  votes: VoteItem[];
  nextCursor: string | null;
  hasNext: boolean;
}
