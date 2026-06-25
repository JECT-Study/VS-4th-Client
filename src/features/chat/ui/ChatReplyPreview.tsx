import clsx from "clsx";
import type { ChatReplyTarget } from "../model/types";

interface ChatReplyPreviewProps {
  replyTarget: ChatReplyTarget | null;
  isDark?: boolean;
  onCancel: () => void;
  onClick?: (messageId: number) => void;
}

export function ChatReplyPreview({ replyTarget, isDark = false, onCancel, onClick }: ChatReplyPreviewProps) {
  if (!replyTarget) return null;

  return (
    <div
      className={clsx(
        "-mx-5 flex min-w-0 items-start gap-3 border-b px-5 py-3 text-left",
        isDark ? "border-[#3C3C3E]" : "border-grey-stroke",
      )}
    >
      <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onClick?.(replyTarget.messageId)}>
        <p className={clsx("truncate text-label-l", isDark ? "text-grey-disabled" : "text-grey-light")}>
          {replyTarget.senderNickname}에게 답장
        </p>
        <p className={clsx("mt-1 truncate text-label-m", isDark ? "text-white" : "text-grey-black")}>
          {replyTarget.content}
        </p>
      </button>
      <button
        type="button"
        className={clsx(
          "flex h-8 w-8 shrink-0 items-center justify-center",
          isDark ? "text-grey-disabled" : "text-grey-light",
        )}
        onClick={onCancel}
        aria-label="답장 취소"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
