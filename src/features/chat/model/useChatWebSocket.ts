import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as stompClient from "@base/api/stompClient";
import { chatMessagesQueryKey } from "../api/chatMessagesQuery"; // .ts 확장자는 지우는 것이 좋습니다.
import type { ChatMessageResponse, ChatMessagesResponse } from "../model/types"; // ChatMessagesResponse 추가

export function useChatWebSocket(voteId: number) {
    const queryClient = useQueryClient();

    useEffect(() => {
        // 1. 컴포넌트 마운트 시 소켓 연결 시작
        stompClient.activate();
        const client = stompClient.getClient();

        // 2. 연결이 완료된 후(onConnect) 구독을 시작
        const onConnect = () => {
            // [구독 1] 새 메시지 수신
            client.subscribe(`/topic/chat/${voteId}`, (message) => {
                const newMessage: ChatMessageResponse = JSON.parse(message.body);

                // React Query 캐시 강제 업데이트 (새 메시지 적용)
                queryClient.setQueryData<ChatMessagesResponse>(
                    chatMessagesQueryKey(voteId),
                    (oldData) => {
                        // 아직 캐시된 데이터가 없다면 무시 (또는 빈 배열로 초기화)
                        if (!oldData) return oldData;

                        // 기존 메시지 배열의 맨 끝에 새 메시지를 추가합니다.
                        // (만약 최신 메시지가 위로 가는 UI라면 [newMessage, ...oldData.messages] 로 순서를 바꿔주세요)
                        return {
                            ...oldData,
                            messages: [...oldData.messages, newMessage],
                        };
                    }
                );
            });

            // [구독 2] 읽지 않은 메시지 개수 수신
            client.subscribe(`/user/topic/chat/${voteId}/unread`, (message) => {
                const unreadCountData = JSON.parse(message.body);
                // 필요한 상태 업데이트 또는 Query 캐시 업데이트
                console.log("Unread Count:", unreadCountData);
            });
        };

        client.onConnect = onConnect;

        // 3. 언마운트 시 연결 해제
        return () => {
            stompClient.deactivate();
        };
    }, [voteId, queryClient]);
}