import { apiClient } from "@base/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ChatMessageResponse } from "../model/types";
import { chatMessagesQueryKey } from "./chatMessagesQuery";

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
    onSuccess: () => {
      // ❗️주의: 웹소켓을 연결하면 어차피 서버에서 새 메시지를 쏴주기 때문에,
      // 여기서 전체 메시지를 다시 가져오도록 무효화(invalidate)할지,
      // 아니면 웹소켓으로 받은 데이터를 캐시에 직접 넣을지(setQueryData) 결정해야 합니다.
      // (현재는 기존 로직을 유지했습니다.)
      queryClient.invalidateQueries({
        queryKey: chatMessagesQueryKey(voteId),
      });

      queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
    },
  });
};
