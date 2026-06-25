import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ChatSelectedOption } from "../model/chatVoteOption";
import type { ChatReplyTarget } from "../model/types";
import { ChatReplyPreview } from "./ChatReplyPreview";
import { ChatSelectedOptionBadge } from "./ChatSelectedOptionBadge";

interface ChatInputBarProps {
  disabled?: boolean;
  placeholder?: string;
  selectedOption?: ChatSelectedOption | null;
  replyTarget?: ChatReplyTarget | null;
  focusSignal?: number;
  onCancelReply?: () => void;
  onReplyTargetClick?: (messageId: number) => void;
  onSubmit?: (message: string) => void;
}

export function ChatInputBar({
  disabled = false,
  placeholder = "메시지를 입력하세요.",
  selectedOption,
  replyTarget,
  focusSignal = 0,
  onCancelReply,
  onReplyTargetClick,
  onSubmit,
}: ChatInputBarProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: message triggers DOM height recalculation
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [message]);

  useLayoutEffect(() => {
    if (focusSignal === 0) return;
    textareaRef.current?.focus();
  }, [focusSignal]);

  const handleSubmit = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || disabled) {
      return;
    }

    onSubmit?.(trimmedMessage);
    setMessage("");
  };

  return (
    <div className="fixed bottom-0 z-20 flex w-full max-w-md flex-col gap-2 px-5 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] -translate-x-1/2 bg-white border-t left-1/2 border-grey-stroke">
      <ChatReplyPreview
        replyTarget={replyTarget ?? null}
        onCancel={onCancelReply ?? (() => {})}
        onClick={onReplyTargetClick}
      />
      <ChatSelectedOptionBadge selectedOption={selectedOption ?? null} />

      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={message}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              handleSubmit();
            }
          }}
          className="flex-1 min-w-0 px-4 py-2.5 rounded-2xl outline-none bg-grey-chat text-label-m text-grey-black placeholder:text-grey-disabled disabled:text-grey-disabled resize-none overflow-y-auto max-h-28"
        />

        <button
          type="button"
          disabled={disabled || message.trim().length === 0}
          onClick={handleSubmit}
          className="flex items-center justify-center text-white rounded-full h-11 w-11 shrink-0 bg-primary disabled:bg-grey-disabled"
          aria-label="메시지 전송"
        >
          <img src="/assets/icons/send.svg" alt="" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
