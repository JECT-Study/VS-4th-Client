import { DynamicBottomSheet } from "@base/ui/DynamicBottomSheet";
import { PROFILE_COLOR } from "@features/signup/config/profileColors";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { chatInfiniteMessagesQueryKey, useInfiniteChatMessagesQuery } from "../api/chatMessagesQuery";
import { useChatRoomHeaderQuery } from "../api/chatRoomHeaderQuery";
import { useSendChatMessageMutation } from "../api/sendChatMessageMutation";
import { formatTimeLabel } from "../lib/formatChatTime";
import type { ChatMessageResponse } from "../model/types";
import { useChatWebSocket } from "../model/useChatWebSocket";
import { useMarkLatestChatAsRead } from "../model/useMarkLatestChatAsRead";

const SCROLL_BUTTON_THRESHOLD_PX = 100;
const LOAD_MORE_THRESHOLD_PX = 50;

const THEME = {
  light: {
    sheet: "",
    title: "text-grey-black",
    headerBorder: "border-grey-divider",
    emptyTitle: "text-grey-black",
    emptyText: "text-grey-light",
    senderNickname: "text-grey-dark",
    otherBubble: "bg-grey-chat text-grey-black",
    myBubble: "bg-white border border-grey-stroke text-grey-black",
    time: "text-grey-light",
    inputContainer: "bg-white border-t border-grey-stroke",
    input: "bg-grey-chat text-grey-black placeholder:text-grey-disabled",
    scrollButton: "bg-white shadow-md text-grey-dark",
    placeholder: "메시지를 입력하세요.",
  },
  dark: {
    sheet: "!bg-[#1B1D20]",
    title: "text-white",
    headerBorder: "border-grey-dark",
    emptyTitle: "text-white",
    emptyText: "text-grey-light",
    senderNickname: "text-white",
    otherBubble: "bg-[#36363A] text-white",
    myBubble: "bg-transparent text-white border border-[#434346]",
    time: "text-grey-light",
    inputContainer: "bg-[#1C1C1E] border-t border-[#3C3C3E]",
    input: "bg-[#2A2C2F] text-white placeholder:text-grey-light",
    scrollButton: "bg-[#3A3A3C] text-white",
    placeholder: "채팅으로 의견을 남겨보세요.",
  },
} as const;

type Theme = (typeof THEME)[keyof typeof THEME];

interface ChatBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  voteId: number;
  isDark?: boolean;
}

export function ChatBottomSheet({ isOpen, onClose, voteId, isDark = false }: ChatBottomSheetProps) {
  const t = isDark ? THEME.dark : THEME.light;
  return (
    <DynamicBottomSheet isOpen={isOpen} onClose={onClose} defaultHeight={70} maxHeight={90} className={t.sheet}>
      {isOpen && <ChatContent voteId={voteId} t={t} />}
    </DynamicBottomSheet>
  );
}

// ---

interface ChatContentProps {
  voteId: number;
  t: Theme;
}

function ChatContent({ voteId, t }: ChatContentProps) {
  const queryClient = useQueryClient();
  const { data: header } = useChatRoomHeaderQuery(voteId);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteChatMessagesQuery(voteId);

  // 채팅을 열 때마다 최신 데이터를 보장한다.
  // VoteDetail: commentCount 갱신 / messages: senderVoteOption 변경 반영
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["votes", String(voteId)] });
    queryClient.invalidateQueries({ queryKey: chatInfiniteMessagesQueryKey(voteId) });
  }, [voteId, queryClient]);
  const sendMessageMutation = useSendChatMessageMutation(voteId);
  useChatWebSocket(voteId);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const prevCountRef = useRef(0);
  const prevScrollHeightRef = useRef(0);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // pages[0] = 최신 페이지, pages[n] = 오래된 페이지 / 각 페이지 내 messages는 getChatMessages에서 이미 오름차순 정렬됨
  const allMessages =
    data?.pages
      .slice()
      .reverse()
      .flatMap((p) => p.messages) ?? [];
  const messagesCount = allMessages.length;
  const latestMessageId = allMessages[allMessages.length - 1]?.messageId ?? null;

  const markAsRead = useMarkLatestChatAsRead(voteId);
  useEffect(() => {
    if (latestMessageId == null) return;
    markAsRead(latestMessageId);
  }, [latestMessageId, markAsRead]);

  // 새 메시지 수신 시 하단 자동 스크롤 (하단에 있을 때만)
  useEffect(() => {
    const isInitialLoad = prevCountRef.current === 0 && messagesCount > 0;
    const isNewMessage = messagesCount > prevCountRef.current;
    prevCountRef.current = messagesCount;

    if (isInitialLoad) {
      bottomRef.current?.scrollIntoView();
    } else if (isNewMessage && isAtBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesCount]);

  // 이전 메시지 로드 후 스크롤 위치 보정 — paint 전 동기 실행으로 점프 방지
  useLayoutEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || prevScrollHeightRef.current === 0) return;
    el.scrollTop += el.scrollHeight - prevScrollHeightRef.current;
    prevScrollHeightRef.current = 0;
  }, []);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (el.scrollTop <= LOAD_MORE_THRESHOLD_PX && hasNextPage && !isFetchingNextPage) {
      prevScrollHeightRef.current = el.scrollHeight;
      fetchNextPage();
    }

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isAtBottom = distanceFromBottom <= SCROLL_BUTTON_THRESHOLD_PX;
    isAtBottomRef.current = isAtBottom;
    setShowScrollButton(!isAtBottom);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
    isAtBottomRef.current = true;
  };

  const isLoaded = !!data;
  const isEnded = header?.status === "ENDED";
  const optionA = header?.optionA ?? "";
  const optionB = header?.optionB ?? "";

  return (
    <div className="flex flex-col h-full">
      <div className={`shrink-0 text-title-m text-center pb-5 border-b ${t.headerBorder} ${t.title}`}>실시간 채팅</div>

      <div className="relative flex-1 min-h-0">
        <div ref={scrollContainerRef} onScroll={handleScroll} className="h-full overflow-y-auto overscroll-contain">
          <div className="flex flex-col justify-end min-h-full">
            {renderMessageArea(isLoaded, allMessages, optionA, optionB, t, isFetchingNextPage)}
            <div ref={bottomRef} />
          </div>
        </div>

        {showScrollButton && (
          <button
            type="button"
            className={`absolute right-5 flex h-12 w-12 items-center justify-center rounded-full ${t.scrollButton}`}
            style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)" }}
            onClick={scrollToBottom}
            aria-label="최신 메시지로 이동"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 8L12 16L20 8"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div className={`shrink-0 ${t.inputContainer}`}>
        {isEnded ? (
          <p className="py-4 text-center text-label-m text-grey-dark">투표가 종료되어 채팅이 마감되었어요.</p>
        ) : (
          <MessageInput
            t={t}
            disabled={sendMessageMutation.isPending}
            onSubmit={(message) => sendMessageMutation.mutate(message)}
          />
        )}
      </div>
    </div>
  );
}

function renderMessageArea(
  isLoaded: boolean,
  messages: ChatMessageResponse[],
  optionA: string,
  optionB: string,
  t: Theme,
  isFetchingMore: boolean,
) {
  if (!isLoaded) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-label-m text-grey-light">불러오는 중...</p>
      </div>
    );
  }
  if (messages.length === 0) {
    return <EmptyState t={t} />;
  }
  return <MessageList messages={messages} optionA={optionA} optionB={optionB} t={t} isFetchingMore={isFetchingMore} />;
}

// ---

interface EmptyStateProps {
  t: Theme;
}

function EmptyState({ t }: EmptyStateProps) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center px-5 text-center">
      <h2 className={`text-h-s ${t.emptyTitle}`}>첫 번째 메시지를 남겨보세요!</h2>
      <p className={`mt-4 whitespace-pre-line text-title-s ${t.emptyText}`}>
        {"가볍게 한마디 남기면\n다른 의견도 자연스럽게 볼 수 있어요"}
      </p>
    </div>
  );
}

// ---

interface MessageListProps {
  messages: ChatMessageResponse[];
  optionA: string;
  optionB: string;
  t: Theme;
  isFetchingMore: boolean;
}

function MessageList({ messages, optionA, optionB, t, isFetchingMore }: MessageListProps) {
  return (
    <section className="px-5 py-4 space-y-4">
      {isFetchingMore && (
        <div className="flex justify-center py-2">
          <p className={`text-label-s ${t.time}`}>이전 메시지 불러오는 중...</p>
        </div>
      )}
      {messages.map((message) => (
        <MessageItem key={message.messageId} message={message} optionA={optionA} optionB={optionB} t={t} />
      ))}
    </section>
  );
}

// ---

interface MessageItemProps {
  message: ChatMessageResponse;
  optionA: string;
  optionB: string;
  t: Theme;
}

function MessageItem({ message, optionA, optionB, t }: MessageItemProps) {
  const isOptionA = message.senderVoteOption === "A";
  const optionLabel = isOptionA ? optionA : optionB;
  const optionTextColor = isOptionA ? "text-secondary" : "text-primary";

  if (message.isMine) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%]">
          <div className="flex justify-end gap-1 mb-2">
            <span className={clsx("text-label-m", t.senderNickname)}>{message.senderNickname}</span>
            {message.senderVoteOption && (
              <span className={clsx("text-label-l max-w-[116px] truncate", optionTextColor)}>{optionLabel}</span>
            )}
          </div>
          <div className="flex items-end gap-2 justify-end">
            <span className={`text-label-s ${t.time}`}>{formatTimeLabel(message.sentAt)}</span>
            <p
              className={`px-[14px] py-3 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl rounded-tr-md text-body-s ${t.myBubble}`}
            >
              {message.content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="flex h-10 w-10 shrink-0">
        <img
          src={PROFILE_COLOR[message.senderProfileIcon as keyof typeof PROFILE_COLOR]}
          alt=""
          className="object-cover w-full h-full rounded-full"
        />
      </div>
      <div className="max-w-[75%]">
        <div className="flex gap-1 mb-2">
          <span className={clsx("text-label-m", t.senderNickname)}>{message.senderNickname}</span>
          {message.senderVoteOption && (
            <span className={clsx("text-label-l max-w-[116px] truncate", optionTextColor)}>{optionLabel}</span>
          )}
        </div>
        <div className="flex items-end gap-2">
          <p
            className={`px-[14px] py-3 rounded-tl-md rounded-bl-2xl rounded-br-2xl rounded-tr-2xl text-body-s ${t.otherBubble}`}
          >
            {message.content}
          </p>
          <span className={`text-label-s ${t.time}`}>{formatTimeLabel(message.sentAt)}</span>
        </div>
      </div>
    </div>
  );
}

// ---

interface MessageInputProps {
  t: Theme;
  disabled: boolean;
  onSubmit: (message: string) => void;
}

function MessageInput({ t, disabled, onSubmit }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: message triggers DOM height recalculation
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [message]);

  const handleSubmit = () => {
    const trimmed = message.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setMessage("");
  };

  return (
    <div
      className="flex items-end gap-2 px-5 pt-2"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)" }}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={message}
        disabled={disabled}
        placeholder={t.placeholder}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        className={`flex-1 min-w-0 px-4 py-2 rounded-2xl outline-none text-body-s resize-none overflow-y-auto max-h-28 disabled:text-grey-disabled ${t.input}`}
      />
      <button
        type="button"
        disabled={disabled || message.trim().length === 0}
        onClick={handleSubmit}
        className="flex items-center justify-center text-white rounded-full h-10 w-10 shrink-0 bg-primary disabled:bg-grey-disabled transition-colors"
        aria-label="메시지 전송"
      >
        <img src="/assets/icons/send.svg" alt="" />
      </button>
    </div>
  );
}
