import { apiClient } from "@base/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyChatReactionToCache } from "../model/chatMessageCache";
import { getChatMessageReactionState, toggleChatMessageReaction } from "../model/chatMessageReaction";
import type { ChatMessageReactionType, ChatMessageResponse, ChatReactionResponse } from "../model/types";

interface ReactChatMessageVariables {
  message: ChatMessageResponse;
  reaction: ChatMessageReactionType;
}

export const reactChatMessage = async (
  voteId: number,
  messageId: number,
  emoji: ChatMessageReactionType | null,
): Promise<ChatReactionResponse> => {
  const { data } = await apiClient.put<ChatReactionResponse>(`/api/chats/${voteId}/messages/${messageId}/reactions`, {
    emoji,
  });
  return data;
};

export const useReactChatMessageMutation = (voteId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ message, reaction }: ReactChatMessageVariables) => {
      const currentReaction = message.myReaction ?? null;
      const nextReaction = currentReaction === reaction ? null : reaction;
      return reactChatMessage(voteId, message.messageId, nextReaction);
    },
    onMutate: async ({ message, reaction }) => {
      const previous = getChatMessageReactionState(message);
      const optimistic = toggleChatMessageReaction(previous, reaction);

      applyChatReactionToCache(queryClient, voteId, {
        messageId: message.messageId,
        reactions: {
          THUMBS_UP: optimistic.THUMBS_UP,
          THUMBS_DOWN: optimistic.THUMBS_DOWN,
        },
        myReaction: optimistic.myReaction,
      });

      return {
        messageId: message.messageId,
        previous,
      };
    },
    onSuccess: (response) => {
      applyChatReactionToCache(queryClient, voteId, response);
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      applyChatReactionToCache(queryClient, voteId, {
        messageId: context.messageId,
        reactions: {
          THUMBS_UP: context.previous.THUMBS_UP,
          THUMBS_DOWN: context.previous.THUMBS_DOWN,
        },
        myReaction: context.previous.myReaction,
      });
    },
  });
};
