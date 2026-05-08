export type ChatTabType = "active" | "ended";

export interface ChatVoteItem {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  lastMessage: string;
  remainingTime?: string;
  participantCount: number;
  unreadCount?: number;
  timeLabel: string;
  status: "active" | "ended";
}

export interface VoteOptionSummary {
  label: string;
  ratio: number;
  color: "orange" | "purple";
}

export interface ChatMessage {
  id: number;
  nickname: string;
  optionLabel: string;
  optionColor: "orange" | "purple";
  message: string;
  time: string;
  isMine?: boolean;
}

export interface ChatRoomDetail {
  id: number;
  title: string;
  participantCount: number;
  remainingTime: string;
  status: "active" | "ended";
  options: [VoteOptionSummary, VoteOptionSummary];
  messages: ChatMessage[];
}
