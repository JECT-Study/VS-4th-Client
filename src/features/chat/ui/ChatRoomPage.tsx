import { useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChatAccessGate } from "./ChatAccessRequiredPage";
import { ChatInputBar } from "./ChatInputBar";
import { ChatMessageList } from "./ChatMessageList";
import { ChatRoomHeader } from "./ChatRoomHeader";
import { VoteSummaryCard } from "./VoteSummaryCard";

import { useChatGaugeQuery } from "../api/chatGaugeQuery";
import { useInfiniteChatMessagesQuery } from "../api/chatMessagesQuery";
import { useChatRoomHeaderQuery } from "../api/chatRoomHeaderQuery";
import { useSendChatMessageMutation } from "../api/sendChatMessageMutation";
import { sortChatMessagesAscending } from "../lib/sortChatMessages";
import { useChatWebSocket } from "../model/useChatWebSocket";
import { useMarkLatestChatAsRead } from "../model/useMarkLatestChatAsRead";

const LOAD_MORE_THRESHOLD_PX = 120;
const SCROLL_BUTTON_THRESHOLD_PX = 180;

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
  const markAsRead = useMarkLatestChatAsRead(voteId);

  const messages = useMemo(() => {
    const pages = messagesData?.pages ?? [];
    return sortChatMessagesAscending(pages.flatMap((page) => page.messages));
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
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      const distanceFromBottom = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      const isAtBottom = distanceFromBottom <= SCROLL_BUTTON_THRESHOLD_PX;
      isAtBottomRef.current = isAtBottom;
      setShowScrollButton(!isAtBottom);

      if (
        !hasScrolledOnEnterRef.current ||
        window.scrollY > LOAD_MORE_THRESHOLD_PX ||
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
      bottomRef.current?.scrollIntoView({ block: "end" });
      isAtBottomRef.current = true;
      setShowScrollButton(false);
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

  const handleScrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    isAtBottomRef.current = true;
    setShowScrollButton(false);
  };

  useEffect(() => {
    if (latestMessageId == null) return;
    markAsRead(latestMessageId);
  }, [latestMessageId, markAsRead]);

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
      <div ref={bottomRef} />

      {showScrollButton && (
        <button
          type="button"
          className="fixed z-20 flex items-center justify-center w-12 h-12 text-grey-black -translate-x-1/2 bg-white border rounded-full shadow-[0_6px_20px_rgba(19,19,19,0.12)] bottom-[calc(88px+env(safe-area-inset-bottom))] left-[calc(50%+144px)] border-grey-stroke"
          onClick={handleScrollToBottom}
          aria-label="최신 메시지로 이동"
        >
          <img src="/assets/icons/arrow-bottom.svg" alt="" className="h-5 w-5" />
        </button>
      )}

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
