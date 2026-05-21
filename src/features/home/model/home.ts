export type VoteStatus = "active" | "ended";

export type VoteSortType = "latest" | "popular" | "participant";

export interface VoteItem {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  remainingTime: string;
  participantCount: number;
  viewCount?: number;
  status: VoteStatus;
}

export interface BottomTabItem {
  key: "home" | "vote" | "chat" | "my";
  label: string;
  path: string;
  icon: string;
  activeIcon: string;
}
