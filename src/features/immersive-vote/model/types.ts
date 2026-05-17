import type { EmojiType, VoteOption, VoteStatus } from "@features/votes/model/types";

export type { EmojiType, VoteOption, VoteStatus };

export interface ImmersiveFeedItem {
  voteId: number;
  title: string;
  content: string;
  imageUrl: string | null;
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
    total: number;
  };
  myEmoji: EmojiType | null;
  commentCount: number;
  currentViewerCount: number;
}

export interface FloatingEmoji {
  id: string;
  emoji: EmojiType;
  x: number;
  y: number;
}

export interface FloatingEmojiOrigin {
  x: number;
  y: number;
}

export interface EmojiReactionItem {
  type: EmojiType;
  count: number;
  isMine: boolean;
  img: string;
  label: string;
}

export interface ImmersiveParticipateResponse {
  voteId: number;
  action: "VOTED" | "CANCELED";
  selectedOptionId: number | null;
  options: VoteOption[];
  remainingFreeVotes: number | null;
}

export interface ImmersiveShareResponse {
  shareUrl: string;
  title: string;
  thumbnailUrl: string | null;
}

export interface ImmersiveLivePayload {
  options: Array<{ optionId: number; voteCount: number; ratio: number }>;
  currentViewerCount: number;
  totalParticipantCount: number;
}
