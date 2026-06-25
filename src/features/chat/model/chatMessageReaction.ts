import type { ChatMessageReactionType, ChatMessageResponse } from "./types";

export interface ChatMessageReactionState {
  THUMBS_UP: number;
  THUMBS_DOWN: number;
  myReaction: ChatMessageReactionType | null;
}

export type ChatMessageReactionOverrides = Record<number, ChatMessageReactionState>;

export function getChatMessageReactionState(message: ChatMessageResponse): ChatMessageReactionState {
  return {
    THUMBS_UP: message.reactions?.THUMBS_UP ?? 0,
    THUMBS_DOWN: message.reactions?.THUMBS_DOWN ?? 0,
    myReaction: message.myReaction ?? null,
  };
}

export function resolveChatMessageReactionState(
  message: ChatMessageResponse,
  overrides: ChatMessageReactionOverrides,
): ChatMessageReactionState {
  return overrides[message.messageId] ?? getChatMessageReactionState(message);
}

export function toggleChatMessageReaction(
  current: ChatMessageReactionState,
  nextReaction: ChatMessageReactionType,
): ChatMessageReactionState {
  const next = { ...current };

  if (current.myReaction === nextReaction) {
    next[nextReaction] = Math.max(0, next[nextReaction] - 1);
    next.myReaction = null;
    return next;
  }

  if (current.myReaction) {
    next[current.myReaction] = Math.max(0, next[current.myReaction] - 1);
  }

  next[nextReaction] += 1;
  next.myReaction = nextReaction;
  return next;
}

export function formatChatReactionCount(count: number): string {
  return count > 99 ? "99+" : String(count);
}
