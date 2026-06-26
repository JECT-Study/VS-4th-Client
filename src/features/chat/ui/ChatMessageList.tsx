import { PROFILE_COLOR } from "@features/signup/config/profileColors";
import { useUserProfileSheet } from "@features/user-profile/model/useUserProfileSheet";
import { UserProfileBottomSheet } from "@features/user-profile/ui/UserProfileBottomSheet";
import clsx from "clsx";
import { useRef, useState } from "react";
import { formatTimeLabel } from "../lib/formatChatTime";
import { scrollToChatMessage } from "../lib/scrollToChatMessage";
import { getChatMessageReactionState } from "../model/chatMessageReaction";
import type { ChatMessageReactionType, ChatMessageResponse, ChatReplyTarget } from "../model/types";
import { ChatMessageContextMenu } from "./ChatMessageContextMenu";
import { ChatMessageReactionBar } from "./ChatMessageReactionBar";
import { ChatMessageReplySnippet } from "./ChatMessageReplySnippet";

interface ChatMessageListProps {
  messages: ChatMessageResponse[];
  optionA: string;
  optionB: string;
  onReaction: (message: ChatMessageResponse, reaction: ChatMessageReactionType) => void;
  onReply: (replyTarget: ChatReplyTarget) => void;
}

interface ContextMenuTarget {
  message: ChatMessageResponse;
  anchorRect: DOMRect;
}

const LONG_PRESS_MS = 500;
const MESSAGE_TOUCH_CLASS = "select-none [-webkit-touch-callout:none] [-webkit-user-select:none]";

const blurActiveTextInput = () => {
  const activeElement = document.activeElement;
  if (
    activeElement instanceof HTMLInputElement ||
    activeElement instanceof HTMLTextAreaElement ||
    (activeElement instanceof HTMLElement && activeElement.isContentEditable)
  ) {
    activeElement.blur();
  }
};

export function ChatMessageList({ messages, optionA, optionB, onReaction, onReply }: ChatMessageListProps) {
  // 일반형 투표 풀페이지 채팅 → 라이트 모드 / 일반형 랜딩
  const profileSheet = useUserProfileSheet({ originSurface: "general" });
  const longPressTimerRef = useRef<number | null>(null);
  const [contextMenuTarget, setContextMenuTarget] = useState<ContextMenuTarget | null>(null);

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current == null) return;
    window.clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  };

  const startLongPress = (message: ChatMessageResponse, element: HTMLElement) => {
    if (message.isMine) return;

    clearLongPressTimer();
    longPressTimerRef.current = window.setTimeout(() => {
      blurActiveTextInput();
      setContextMenuTarget({ message, anchorRect: element.getBoundingClientRect() });
      longPressTimerRef.current = null;
    }, LONG_PRESS_MS);
  };

  const closeContextMenu = () => setContextMenuTarget(null);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-5 text-center">
        <h2 className="text-title-m text-grey-black">첫 번째 메시지를 남겨보세요!</h2>
        <p className="mt-4 whitespace-pre-line text-body-s text-grey-light">
          가볍게 한마디 남기면{"\n"}다른 의견도 자연스럽게 볼 수 있어요
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="flex flex-col justify-end flex-1 px-5 pt-4 pb-1 space-y-5">
        {messages.map((message) => {
          const isOptionA = message.senderVoteOption === "A";
          const optionLabel = isOptionA ? optionA : optionB;
          const optionTextColor = isOptionA ? "text-secondary" : "text-primary";
          const reactionState = getChatMessageReactionState(message);

          // "알 수 없음" 처리 및 표시 이름 설정
          const isUnknownUser = message.senderNickname === "알 수 없음" || !message.senderProfileIcon;
          const displayName = message.senderNickname === "알 수 없음" ? "(알 수 없음)" : message.senderNickname;
          const canOpenProfile = !isUnknownUser;
          const handleProfileClick = () => profileSheet.openProfile(message.senderId);

          if (message.isMine) {
            return (
              <div
                key={message.messageId}
                className="flex justify-end px-1 py-1"
                data-chat-message-id={message.messageId}
              >
                <div className="max-w-[75%]">
                  <div className="flex justify-end gap-1 mb-1 text-label-s">
                    <span className="text-grey-dark">{displayName}</span>
                    {message.senderVoteOption && (
                      <span className={clsx(optionTextColor, "max-w-[116px] truncate")}>{optionLabel}</span>
                    )}
                  </div>

                  <div className="flex items-end justify-end gap-2">
                    <span className="text-label-s text-grey-light">{formatTimeLabel(message.sentAt)}</span>
                    <div
                      className={clsx(
                        "overflow-hidden bg-white border rounded-2xl border-grey-stroke text-grey-black",
                        MESSAGE_TOUCH_CLASS,
                      )}
                    >
                      <ChatMessageReplySnippet replyTo={message.replyTo} onClick={scrollToChatMessage} />
                      <p className="px-4 py-3 text-label-m">{message.content}</p>
                    </div>
                  </div>
                  <ChatMessageReactionBar reactionState={reactionState} align="right" />
                </div>
              </div>
            );
          }

          return (
            <div key={message.messageId} className="flex gap-3 px-1 py-1" data-chat-message-id={message.messageId}>
              <button
                type="button"
                className="flex w-10 h-10 shrink-0"
                onClick={handleProfileClick}
                disabled={!canOpenProfile}
                aria-label={`${displayName} 프로필 보기`}
              >
                <img
                  src={
                    isUnknownUser
                      ? "/assets/icons/default-profile.svg"
                      : PROFILE_COLOR[message.senderProfileIcon as keyof typeof PROFILE_COLOR]
                  }
                  alt=""
                  className="object-cover w-full h-full bg-gray-200 rounded-full"
                />
              </button>
              <div className="max-w-[75%]">
                <div className="flex gap-1 mb-1 text-label-s">
                  <button
                    type="button"
                    className="text-grey-dark"
                    onClick={handleProfileClick}
                    disabled={!canOpenProfile}
                  >
                    {displayName}
                  </button>
                  {message.senderVoteOption && (
                    <span className={clsx(optionTextColor, "max-w-[116px] truncate")}>{optionLabel}</span>
                  )}
                </div>

                <div className="flex items-end gap-2">
                  <div
                    className={clsx("overflow-hidden rounded-2xl bg-grey-chat text-grey-black", MESSAGE_TOUCH_CLASS)}
                    onPointerDown={(event) => startLongPress(message, event.currentTarget)}
                    onPointerUp={clearLongPressTimer}
                    onPointerCancel={clearLongPressTimer}
                    onPointerLeave={clearLongPressTimer}
                    onContextMenu={(event) => event.preventDefault()}
                  >
                    <ChatMessageReplySnippet replyTo={message.replyTo} onClick={scrollToChatMessage} />
                    <p className="px-4 py-3 text-label-m">{message.content}</p>
                  </div>
                  <span className="text-label-s text-grey-light">{formatTimeLabel(message.sentAt)}</span>
                </div>
                <ChatMessageReactionBar reactionState={reactionState} align="left" />
              </div>
            </div>
          );
        })}
      </section>

      {contextMenuTarget && (
        <ChatMessageContextMenu
          anchorRect={contextMenuTarget.anchorRect}
          onClose={closeContextMenu}
          onReact={(reaction) => onReaction(contextMenuTarget.message, reaction)}
          onReply={() =>
            onReply({
              messageId: contextMenuTarget.message.messageId,
              senderNickname: contextMenuTarget.message.senderNickname,
              content: contextMenuTarget.message.content,
            })
          }
        />
      )}

      <UserProfileBottomSheet
        isOpen={profileSheet.isOpen}
        onClose={profileSheet.close}
        profile={profileSheet.profile}
        isDark={false}
        onVoteClick={profileSheet.handleVoteClick}
      />
    </>
  );
}
