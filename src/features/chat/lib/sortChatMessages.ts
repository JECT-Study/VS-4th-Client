import type { ChatMessageResponse } from "../model/types";

const getSentAtTime = (sentAt: string) => {
  const time = Date.parse(sentAt);
  return Number.isNaN(time) ? null : time;
};

export const sortChatMessagesAscending = (messages: ChatMessageResponse[]) =>
  [...messages].sort((a, b) => {
    const aTime = getSentAtTime(a.sentAt);
    const bTime = getSentAtTime(b.sentAt);

    if (aTime != null && bTime != null && aTime !== bTime) {
      return aTime - bTime;
    }

    return a.messageId - b.messageId;
  });
