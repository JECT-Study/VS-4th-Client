import { useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";
import { ChatAccessGate } from "./ChatAccessRequiredPage";
import { ChatInputBar } from "./ChatInputBar";
import { ChatMessageList } from "./ChatMessageList";
import { ChatRoomHeader } from "./ChatRoomHeader";
import { VoteSummaryCard } from "./VoteSummaryCard";

import { useChatGaugeQuery } from "../api/chatGaugeQuery";
import { useChatMessagesQuery } from "../api/chatMessagesQuery";
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

  const { data: messagesData, isLoading: isMessagesLoading, isError: isMessagesError } = useChatMessagesQuery(voteId);

  const sendMessageMutation = useSendChatMessageMutation(voteId);
  const markAsReadMutation = useMarkChatAsReadMutation();

  const latestMessageId = useMemo(() => {
    const messageIds =
      messagesData?.messages.map((message) => message.messageId).filter((messageId) => messageId > 0) ?? [];

    return messageIds.length > 0 ? Math.max(...messageIds) : null;
  }, [messagesData?.messages]);

  const scrollTrigger = useMemo(() => {
    const messages = messagesData?.messages;
    if (!messages || messages.length === 0) return null;

    const lastMessage = messages[messages.length - 1]!;
    return `${messages.length}-${lastMessage.messageId}`;
  }, [messagesData?.messages]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const hasScrolledOnEnterRef = useRef(false);

  useEffect(() => {
    const updateIsAtBottom = () => {
      const scrollElement = document.documentElement;
      const distanceFromBottom = scrollElement.scrollHeight - window.scrollY - window.innerHeight;
      isAtBottomRef.current = distanceFromBottom <= 120;
    };

    updateIsAtBottom();
    window.addEventListener("scroll", updateIsAtBottom, { passive: true });
    window.addEventListener("resize", updateIsAtBottom);

    return () => {
      window.removeEventListener("scroll", updateIsAtBottom);
      window.removeEventListener("resize", updateIsAtBottom);
    };
  }, []);

  useEffect(() => {
    if (scrollTrigger == null) return;

    if (!hasScrolledOnEnterRef.current) {
      hasScrolledOnEnterRef.current = true;
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ block: "end" });
        isAtBottomRef.current = true;
      });
      return;
    }

    if (!isAtBottomRef.current) return;

    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
      isAtBottomRef.current = true;
    });
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
    <main className="min-h-screen pb-20 bg-white">
      <ChatRoomHeader title={header.title} participantCount={gauge.participantCount} />

      <VoteSummaryCard header={header} gauge={gauge} />

      <ChatMessageList messages={messagesData.messages} optionA={header.optionA} optionB={header.optionB} />
      <div ref={bottomRef} aria-hidden="true" />

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
