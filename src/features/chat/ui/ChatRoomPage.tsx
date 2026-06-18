import { useParams, useSearch } from "@tanstack/react-router";
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
  const search = useSearch({ from: "/chat/$chatRoomId" });
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
  const backTab = search.tab === "ENDED" || search.tab === "ONGOING" ? search.tab : header.status;

  const handleSubmitMessage = (message: string) => {
    sendMessageMutation.mutate(message);
  };

  return (
    <main className="min-h-screen bg-white">
      <ChatRoomHeader title={header.title} participantCount={gauge.participantCount} backTab={backTab} />

      <VoteSummaryCard header={header} gauge={gauge} />

      <ChatMessageList messages={messages} optionA={header.optionA} optionB={header.optionB} />

      {/* 입력창 높이를 고려하여 하단 여백 복구 */}
      <div className="h-[calc(88px+env(safe-area-inset-bottom))] shrink-0" aria-hidden="true" />
      <div ref={bottomRef} />

      {showScrollButton && (
        <button
          type="button"
          // 👇 버튼 위치도 변경된 높이에 맞게 살짝 수정
          className="fixed z-20 flex items-center justify-center w-12 h-12 text-grey-black -translate-x-1/2 bg-white border rounded-full shadow-[0_6px_20px_rgba(19,19,19,0.12)] bottom-[calc(76px+env(safe-area-inset-bottom))] left-[calc(50%+144px)] border-grey-stroke"
          onClick={handleScrollToBottom}
          aria-label="최신 메시지로 이동"
        >
          <img src="/assets/icons/arrow-bottom.svg" alt="" className="w-5 h-5" />
        </button>
      )}

      {isEnded ? (
        <div
          className="fixed w-full text-center bottom-0 text-label-m text-grey-dark bg-white pt-[18px] max-w-md"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)",
          }}
        >
          투표가 종료되어 채팅이 마감되었어요.
        </div>
      ) : (
        <ChatInputBar disabled={sendMessageMutation.isPending} onSubmit={handleSubmitMessage} />
      )}
    </main>
  );
}
