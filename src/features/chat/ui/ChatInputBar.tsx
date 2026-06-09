import { useEffect, useRef, useState } from "react";

interface ChatInputBarProps {
  disabled?: boolean;
  placeholder?: string;
  onSubmit?: (message: string) => void;
}

export function ChatInputBar({ disabled = false, placeholder = "메시지를 입력하세요.", onSubmit }: ChatInputBarProps) {
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
    const trimmedMessage = message.trim();

    if (!trimmedMessage || disabled) {
      return;
    }

    onSubmit?.(trimmedMessage);
    setMessage("");
  };

  return (
    // 👇 핵심 수정: py-3 제거 -> pt-3 및 pb-[calc(12px+env(safe-area-inset-bottom))] 적용
    <div className="fixed bottom-0 z-20 flex items-end w-full max-w-md gap-2 px-5 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] -translate-x-1/2 bg-white border-t left-1/2 border-grey-stroke">
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
  );
}
