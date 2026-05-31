import { useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";
import { ChatAccessGate } from "./ChatAccessRequiredPage";
import { ChatInputBar } from "./ChatInputBar";
import { ChatMessageList } from "./ChatMessageList";
import { ChatRoomHeader } from "./ChatRoomHeader";
import { VoteSummaryCard } from "./VoteSummaryCard";

import { useChatGaugeQuery } from "../api/chatGaugeQuery";
import { useInfiniteChatMessagesQuery } from "../api/chatMessagesQuery";
import { useChatRoomHeaderQuery } from "../api/chatRoomHeaderQuery";
import { useMarkChatAsReadMutation } from "../api/markChatAsRead";
import { useSendChatMessageMutation } from "../api/sendChatMessageMutation";
import { useChatWebSocket } from "../model/useChatWebSocket";

export function ChatRoomPage() {
  return (
    <ChatAccessGate>
      <ChatRoomContent />
    </ChatAccessGate>
  );
}

function ChatRoomContent() {
  const params = useParams({ strict: false });
  const voteId = Number(params.chatRoomId);
  const { data: header, isLoading: isHeaderLoading, isError: isHeaderError } = useChatRoomHeaderQuery(voteId);

  const {
    data: gauge,
    isLoading: isGaugeLoading,
    isError: isGaugeError,
  } = useChatGaugeQuery({
    voteId,
    status: header?.status,
  });

  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteChatMessagesQuery(voteId);

  const sendMessageMutation = useSendChatMessageMutation(voteId);
  const markAsReadMutation = useMarkChatAsReadMutation();

  const messages = useMemo(() => {
    const pages = messagesData?.pages ?? [];
    return [...pages].reverse().flatMap((page) => page.messages);
  }, [messagesData?.pages]);

  const latestMessageId = useMemo(() => {
    const messageIds = messages.map((message) => message.messageId).filter((messageId) => messageId > 0);

    return messageIds.length > 0 ? Math.max(...messageIds) : null;
  }, [messages]);

  const scrollTrigger = useMemo(() => {
    const lastMessage = messages[messages.length - 1];
    return lastMessage ? `${messages.length}-${lastMessage.messageId}` : null;
  }, [messages]);

  const isAtBottomRef = useRef(true);
  const hasScrolledOnEnterRef = useRef(false);
  const isFetchingOlderMessagesRef = useRef(false);

  useEffect(() => {
    const updateScrollState = () => {
      const distanceFromBottom = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      isAtBottomRef.current = distanceFromBottom <= 140;

      if (
        !hasScrolledOnEnterRef.current ||
        window.scrollY > 160 ||
        !hasNextPage ||
        isFetchingNextPage ||
        isFetchingOlderMessagesRef.current
      ) {
        return;
      }

      const previousScrollHeight = document.documentElement.scrollHeight;
      isFetchingOlderMessagesRef.current = true;

      fetchNextPage().finally(() => {
        requestAnimationFrame(() => {
          const nextScrollHeight = document.documentElement.scrollHeight;
          window.scrollTo({ top: window.scrollY + nextScrollHeight - previousScrollHeight, behavior: "auto" });
          isFetchingOlderMessagesRef.current = false;
        });
      });
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (scrollTrigger == null) return;

    const scrollToBottom = () => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "auto" });
      isAtBottomRef.current = true;
    };

    if (!hasScrolledOnEnterRef.current) {
      hasScrolledOnEnterRef.current = true;
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToBottom);
      });
      return;
    }

    if (!isAtBottomRef.current) return;

    requestAnimationFrame(scrollToBottom);
  }, [scrollTrigger]);

  const lastMarkedReadRef = useRef<{ voteId: number; messageId: number } | null>(null);
  useEffect(() => {
    const alreadyMarkedRead =
      lastMarkedReadRef.current?.voteId === voteId && lastMarkedReadRef.current.messageId === latestMessageId;

    if (!Number.isFinite(voteId) || latestMessageId == null || alreadyMarkedRead) {
      return;
    }

    lastMarkedReadRef.current = { voteId, messageId: latestMessageId };
    markAsReadMutation.mutate({ voteId, lastReadMessageId: latestMessageId });
  }, [voteId, latestMessageId, markAsReadMutation.mutate]);

  // 실시간 웹소켓 구독 시작
  useChatWebSocket(voteId);

  const isLoading = isHeaderLoading || isGaugeLoading || isMessagesLoading;
  const isError = isHeaderError || isGaugeError || isMessagesError;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="py-10 text-center text-label-m text-grey-light">채팅방을 불러오는 중입니다.</div>
      </main>
    );
  }

  if (isError || !header || !gauge || !messagesData) {
    return (
      <main className="min-h-screen bg-white">
        <div className="py-10 text-center text-label-m text-grey-light">채팅방을 불러오지 못했습니다.</div>
      </main>
    );
  }

  const isEnded = header.status === "ENDED";

  const handleSubmitMessage = (message: string) => {
    sendMessageMutation.mutate(message);
  };

  return (
    <main className="min-h-screen bg-white pb-[calc(112px+env(safe-area-inset-bottom))]">
      <ChatRoomHeader title={header.title} participantCount={gauge.participantCount} />

      <VoteSummaryCard header={header} gauge={gauge} />

      <ChatMessageList messages={messages} optionA={header.optionA} optionB={header.optionB} />

      {isEnded ? (
        <div className="fixed left-0 right-0 text-center bottom-8 text-label-m text-grey-light">
          투표가 종료되어 채팅이 마감되었어요.
        </div>
      ) : (
        <ChatInputBar disabled={sendMessageMutation.isPending} onSubmit={handleSubmitMessage} />
      )}
    </main>
  );
}
