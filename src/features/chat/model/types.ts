export type ChatTabType = "ONGOING" | "ENDED";

export interface ChatListItemResponse {
  voteId: number;
  title: string;
  thumbnailUrl: string;
  optionA: string;
  optionB: string;
  participantCount: number;
  lastMessage: string;
  lastMessageAt: string;
  endAt: string;
  unreadCount: number;
}

export interface ChatListResponse {
  chats: ChatListItemResponse[];
}

export interface ChatRoomHeaderResponse {
  voteId: number;
  title: string;
  status: ChatTabType;
  participantCount: number;
  optionA: string;
  optionB: string;
  endAt: string;
}

export interface ChatGaugeResponse {
  optionARatio: number;
  optionBRatio: number;
  participantCount: number;
}

export type SenderVoteOption = "A" | "B" | null;

export interface ChatMessageResponse {
  messageId: number;
  content: string;
  sentAt: string;
  senderNickname: string;
  senderProfileIcon: string;
  senderVoteOption: SenderVoteOption;
  isMine: boolean;
}

export interface ChatMessagesResponse {
  messages: ChatMessageResponse[];
  nextCursor: number | null;
  hasNext: boolean;
}
