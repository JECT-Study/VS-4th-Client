export type VoteStatus = "ONGOING" | "ENDED";

export type EmojiType = "LIKE" | "SAD" | "ANGRY" | "WOW";

export interface VoteOption {
  optionId: number;
  label: string;
  voteCount: number | null;
  ratio: number | null;
}

export interface VoteDetail {
  voteId: number;
  title: string;
  createdAt: string;
  content: string;
  thumbnailUrl: string | null;
  status: VoteStatus;
  endAt: string;
  participantCount: number;
  options: VoteOption[];
  myVote: {
    voted: boolean;
    selectedOptionId: number | null;
  };
  emojiSummary: {
    LIKE: number;
    SAD: number;
    ANGRY: number;
    WOW: number;
  };
  myEmoji: EmojiType | null;
  commentCount: number;
}

export interface ParticipateResponse {
  voteId: number;
  selectedOptionId: number;
  options: VoteOption[];
  participantCount: number;
  remainingFreeVotes: number | null;
}

export interface EmojiResponse {
  emojiSummary: {
    LIKE: number;
    SAD: number;
    ANGRY: number;
    WOW: number;
    total: number;
  };
  myEmoji: EmojiType | null;
}
