import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { chatInfiniteMessagesQueryKey, chatMessagesQueryKey } from "../api/chatMessagesQuery";
import type { ChatMessageResponse, ChatMessagesResponse, ChatReactionResponse } from "./types";

function updateMessage(
  message: ChatMessageResponse,
  updater: (message: ChatMessageResponse) => ChatMessageResponse,
): ChatMessageResponse {
  return updater(message);
}

export function updateChatMessageInCache(
  queryClient: QueryClient,
  voteId: number,
  messageId: number,
  updater: (message: ChatMessageResponse) => ChatMessageResponse,
) {
  queryClient.setQueryData<ChatMessagesResponse>(chatMessagesQueryKey(voteId), (oldData) => {
    if (!oldData) return oldData;
    return {
      ...oldData,
      messages: oldData.messages.map((message) =>
        message.messageId === messageId ? updateMessage(message, updater) : message,
      ),
    };
  });

  queryClient.setQueryData<InfiniteData<ChatMessagesResponse, number | undefined>>(
    chatInfiniteMessagesQueryKey(voteId),
    (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          messages: page.messages.map((message) =>
            message.messageId === messageId ? updateMessage(message, updater) : message,
          ),
        })),
      };
    },
  );
}

export function applyChatReactionToCache(queryClient: QueryClient, voteId: number, response: ChatReactionResponse) {
  updateChatMessageInCache(queryClient, voteId, response.messageId, (message) => ({
    ...message,
    reactions: response.reactions,
    myReaction: response.myReaction,
  }));
}

export function applyChatReactionCountsToCache(
  queryClient: QueryClient,
  voteId: number,
  messageId: number,
  reactions: ChatReactionResponse["reactions"],
) {
  updateChatMessageInCache(queryClient, voteId, messageId, (message) => ({
    ...message,
    reactions,
  }));
}
