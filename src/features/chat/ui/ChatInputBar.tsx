interface ChatInputBarProps {
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInputBar({ disabled = false, placeholder = "메시지를 입력하세요." }: ChatInputBarProps) {
  return (
    <div className="fixed bottom-0 z-20 flex items-center w-full max-w-md gap-2 px-5 py-3 -translate-x-1/2 bg-white border-t left-1/2 border-grey-stroke">
      <input
        disabled={disabled}
        placeholder={placeholder}
        className="flex-1 min-w-0 px-4 rounded-full outline-none h-11 bg-grey-chat text-label-m text-grey-black placeholder:text-grey-disabled disabled:text-grey-disabled"
      />

      <button
        type="button"
        disabled={disabled}
        className="flex items-center justify-center text-white rounded-full h-11 w-11 shrink-0 bg-primary disabled:bg-grey-disabled"
        aria-label="메시지 전송"
      >
        ✈
      </button>
    </div>
  );
}
