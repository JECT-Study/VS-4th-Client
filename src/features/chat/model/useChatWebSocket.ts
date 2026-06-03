import * as stompClient from "@base/api/stompClient";
import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { chatInfiniteMessagesQueryKey, chatMessagesQueryKey } from "../api/chatMessagesQuery";
import type { ChatMessageResponse, ChatMessagesResponse } from "../model/types";
import { consumePending } from "./pendingOutgoingMessages";
import { useMarkLatestChatAsRead } from "./useMarkLatestChatAsRead";

export function useChatWebSocket(voteId: number) {
  const queryClient = useQueryClient();
  const markAsRead = useMarkLatestChatAsRead(voteId);

  useEffect(() => {
    // 1. 소켓 클라이언트 인스턴스를 먼저 확보합니다.
    const client = stompClient.getClient();

    // 2. [순서 변경] 연결 성공 후 실행할 onConnect 콜백을 activate보다 '먼저' 정의하고 할당합니다.
    const onConnect = () => {
      // [구독 1] 새 메시지 수신
      client.subscribe(`/topic/chat/${voteId}`, (message) => {
        try {
          const newMessage: ChatMessageResponse = JSON.parse(message.body);

          // VoteDetail 캐시의 commentCount를 +1 (자신이 보낸 메시지 포함)
          queryClient.setQueryData(["votes", String(voteId)], (old: { commentCount: number } | undefined) =>
            old ? { ...old, commentCount: old.commentCount + 1 } : old,
          );

          // 내가 보낸 메시지는 낙관적 업데이트가 이미 처리 중이므로 건너뜁니다.
          // (WebSocket 브로드캐스트의 isMine: false 가 캐시를 덮어쓰는 것을 방지)
          if (consumePending(voteId, newMessage.content)) {
            markAsRead(newMessage.messageId);
            return;
          }

          // ChatRoomPage 단일 쿼리 캐시 업데이트
          queryClient.setQueryData<ChatMessagesResponse>(chatMessagesQueryKey(voteId), (oldData) => {
            if (!oldData) return oldData;
            return { ...oldData, messages: [...oldData.messages, newMessage] };
          });

          // ChatBottomSheet infinite 쿼리 캐시 업데이트 (pages[0]이 최신 페이지)
          queryClient.setQueryData<InfiniteData<ChatMessagesResponse, number | undefined>>(
            chatInfiniteMessagesQueryKey(voteId),
            (oldData): InfiniteData<ChatMessagesResponse, number | undefined> | undefined => {
              const latestPage = oldData?.pages[0];
              if (!oldData || !latestPage) return oldData;
              const alreadyExists = oldData.pages.some((page) =>
                page.messages.some((m) => m.messageId === newMessage.messageId),
              );
              if (alreadyExists) return oldData;
              const updatedPages: ChatMessagesResponse[] = [
                { ...latestPage, messages: [newMessage, ...latestPage.messages] },
                ...oldData.pages.slice(1),
              ];
              return { ...oldData, pages: updatedPages };
            },
          );

          markAsRead(newMessage.messageId);
        } catch (error) {
          // 데이터 파싱 실패 시 런타임 에러가 전파되지 않도록 방어하고 개발 환경에서만 에러를 출력합니다.
          if (import.meta.env.DEV) {
            console.error("Failed to parse real-time chat message:", error);
          }
        }
      });

      // [구독 2] 읽지 않은 메시지 개수 수신
      client.subscribe(`/user/topic/chat/${voteId}/unread`, (message) => {
        try {
          const unreadCountData = JSON.parse(message.body);
          // 변수를 실제로 사용하여 React Query 캐시를 업데이트합니다. (TS6133 에러 해결)
          // 추후 UI에서 이 쿼리 키를 통해 안 읽은 메시지 개수를 렌더링할 수 있습니다.
          queryClient.setQueryData(["chat", voteId, "unread"], unreadCountData);
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error("Failed to parse unread count message:", error);
          }
        }
      });
    };

    // activate 호출 전 명시적 등록으로 race condition 방지
    client.onConnect = onConnect;

    // 3. 모든 이벤트 핸들러가 바인딩된 후 안전하게 소켓 활성화
    stompClient.activate();

    // 4. 언마운트 시 라이프사이클 클린업
    return () => {
      stompClient.deactivate();
    };
  }, [voteId, queryClient, markAsRead]);
}
