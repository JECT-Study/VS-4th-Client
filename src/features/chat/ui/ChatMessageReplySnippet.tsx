import clsx from "clsx";
import type { ChatMessageReplyTo } from "../model/types";

interface ChatMessageReplySnippetProps {
  replyTo: ChatMessageReplyTo | null | undefined;
  isDark?: boolean;
  onClick?: (messageId: number) => void;
}

export function ChatMessageReplySnippet({ replyTo, isDark = false, onClick }: ChatMessageReplySnippetProps) {
  if (!replyTo) return null;

  return (
    <button
      type="button"
      className={clsx(
        "block w-full min-w-0 border-b px-4 py-2 text-left",
        "select-none [-webkit-touch-callout:none] [-webkit-user-select:none]",
        isDark ? "border-[#434346] bg-[#25272A]" : "border-grey-stroke bg-grey-divider",
      )}
      onClick={() => onClick?.(replyTo.messageId)}
      onContextMenu={(event) => event.preventDefault()}
    >
      <p className={clsx("truncate text-label-s", isDark ? "text-grey-disabled" : "text-grey-light")}>
        {replyTo.senderNickname}에게 답장
      </p>
      <p className={clsx("mt-1 truncate text-label-s", isDark ? "text-white" : "text-grey-dark")}>
        {replyTo.contentPreview}
      </p>
    </button>
  );
}
