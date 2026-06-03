import { useCallback } from "react";
import { markChatAsRead, useMarkChatAsReadMutation } from "../api/markChatAsRead";

const lastMarkedMessageIdByVote = new Map<number, number>();

export function shouldMarkChatAsRead(voteId: number, messageId: number): boolean {
  if (!Number.isFinite(voteId) || messageId <= 0) return false;
  return lastMarkedMessageIdByVote.get(voteId) !== messageId;
}

function rememberMarkedChatAsRead(voteId: number, messageId: number) {
  lastMarkedMessageIdByVote.set(voteId, messageId);
}

export async function markLatestChatAsRead(voteId: number, messageId: number) {
  if (!shouldMarkChatAsRead(voteId, messageId)) return;

  rememberMarkedChatAsRead(voteId, messageId);
  await markChatAsRead(voteId, messageId);
}

export function useMarkLatestChatAsRead(voteId: number) {
  const markAsReadMutation = useMarkChatAsReadMutation();

  const markAsRead = useCallback(
    (messageId: number) => {
      if (!shouldMarkChatAsRead(voteId, messageId)) return;

      rememberMarkedChatAsRead(voteId, messageId);
      markAsReadMutation.mutate({ voteId, lastReadMessageId: messageId });
    },
    [voteId, markAsReadMutation.mutate],
  );

  return markAsRead;
}
