import { apiClient } from "@base/api/client";
import type { InfiniteData } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPending, consumePending } from "../model/pendingOutgoingMessages";
import type { ChatMessageResponse, ChatMessagesResponse } from "../model/types";
import { chatInfiniteMessagesQueryKey } from "./chatMessagesQuery";

// 1. API 호출 함수 (전송)
export const sendChatMessageMutation = async (voteId: number, content: string) => {
  const { data } = await apiClient.post<ChatMessageResponse>(`/api/chats/${voteId}/messages`, { content });
  return data;
};

// 2. API 호출 함수 (읽음 처리 - 필요시 별도 분리 가능)
export const readChat = async (voteId: number, lastReadMessageId: number) => {
  await apiClient.post(`/api/chats/${voteId}/read`, { lastReadMessageId });
};

// 3. React Query 훅
export const useSendChatMessageMutation = (voteId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => sendChatMessageMutation(voteId, content),

    onMutate: async (content) => {
      addPending(voteId, content);

      await queryClient.cancelQueries({ queryKey: chatInfiniteMessagesQueryKey(voteId) });

      const snapshot = queryClient.getQueryData<InfiniteData<ChatMessagesResponse, number | undefined>>(
        chatInfiniteMessagesQueryKey(voteId),
      );
      if (!snapshot) return { tempId: null };

      // 캐시에 있는 내 이전 메시지에서 닉네임/아이콘/투표옵션을 가져옵니다.
      const allMessages = snapshot.pages.flatMap((p) => p.messages);
      const myPrevious = [...allMessages].reverse().find((m) => m.isMine);

      const tempId = -Date.now();
      const tempMessage: ChatMessageResponse = {
        messageId: tempId,
        content,
        sentAt: new Date().toISOString(),
        senderNickname: myPrevious?.senderNickname ?? "",
        senderProfileIcon: myPrevious?.senderProfileIcon ?? "",
        senderVoteOption: myPrevious?.senderVoteOption ?? "A",
        isMine: true,
      };

      queryClient.setQueryData<InfiniteData<ChatMessagesResponse, number | undefined>>(
        chatInfiniteMessagesQueryKey(voteId),
        (oldData) => {
          if (!oldData) return oldData;
          const latestPage = oldData.pages[0];
          if (!latestPage) return oldData;
          return {
            ...oldData,
            pages: [{ ...latestPage, messages: [tempMessage, ...latestPage.messages] }, ...oldData.pages.slice(1)],
          };
        },
      );

      return { tempId };
    },

    onSuccess: (data, _content, context) => {
      // 임시 메시지를 서버에서 받은 실제 메시지(isMine: true)로 교체합니다.
      queryClient.setQueryData<InfiniteData<ChatMessagesResponse, number | undefined>>(
        chatInfiniteMessagesQueryKey(voteId),
        (oldData) => {
          if (!oldData || !context?.tempId) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              messages: page.messages.map((m) => (m.messageId === context.tempId ? data : m)),
            })),
          };
        },
      );

      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },

    onError: (_error, _content, context) => {
      // 전송 실패 시 낙관적 메시지를 롤백합니다.
      queryClient.setQueryData<InfiniteData<ChatMessagesResponse, number | undefined>>(
        chatInfiniteMessagesQueryKey(voteId),
        (oldData) => {
          if (!oldData || !context?.tempId) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              messages: page.messages.filter((m) => m.messageId !== context.tempId),
            })),
          };
        },
      );
    },

    onSettled: (_data, _error, content) => {
      // WebSocket이 아직 소비하지 않은 pending 항목을 정리합니다.
      consumePending(voteId, content);
    },
  });
};
