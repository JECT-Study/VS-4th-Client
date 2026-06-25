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
  createdAt?: string;
  endAt: string;
  unreadCount: number;
}

export interface ChatListResponse {
  chats: ChatListItemResponse[];
}

export type SenderVoteOption = "A" | "B" | null;

export interface ChatRoomHeaderResponse {
  voteId: number;
  title: string;
  status: ChatTabType;
  participantCount: number;
  optionA: string;
  optionB: string;
  endAt: string;
  myVoteOption: SenderVoteOption;
}

export interface ChatGaugeResponse {
  optionARatio: number;
  optionBRatio: number;
  participantCount: number;
}

export type ChatMessageReactionType = "THUMBS_UP" | "THUMBS_DOWN";

export interface ChatMessageReactionSummary {
  THUMBS_UP: number;
  THUMBS_DOWN: number;
}

export interface ChatReplyTarget {
  messageId: number;
  senderNickname: string;
  content: string;
}

export interface ChatMessageReplyTo {
  messageId: number;
  senderNickname: string;
  contentPreview: string;
}

export interface ChatMessageResponse {
  messageId: number;
  content: string;
  sentAt: string;
  senderId: number;
  senderNickname: string;
  senderProfileIcon: string;
  senderVoteOption: SenderVoteOption;
  isMine: boolean;
  replyTo?: ChatMessageReplyTo | null;
  reactions?: Partial<ChatMessageReactionSummary>;
  myReaction?: ChatMessageReactionType | null;
}

export interface ChatReactionResponse {
  messageId: number;
  reactions: Partial<ChatMessageReactionSummary>;
  myReaction: ChatMessageReactionType | null;
}

export interface ChatReactionUpdatedEvent {
  event: "REACTION_UPDATED";
  messageId: number;
  reactions: Partial<ChatMessageReactionSummary>;
}

export interface ChatMessagesResponse {
  messages: ChatMessageResponse[];
  nextCursor: number | null;
  hasNext: boolean;
}
