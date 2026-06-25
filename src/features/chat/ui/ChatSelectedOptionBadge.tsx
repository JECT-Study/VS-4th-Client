import clsx from "clsx";
import type { ChatSelectedOption } from "../model/chatVoteOption";

interface ChatSelectedOptionBadgeProps {
  selectedOption: ChatSelectedOption | null;
  className?: string;
}

export function ChatSelectedOptionBadge({ selectedOption, className }: ChatSelectedOptionBadgeProps) {
  if (!selectedOption) return null;

  const optionColor = selectedOption.voteOption === "A" ? "text-secondary" : "text-primary";

  return (
    <div className={clsx("flex min-w-0 items-center gap-1", optionColor, className)}>
      <CheckIcon />
      <span className="min-w-0 truncate text-label-s">{selectedOption.label}</span>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M3.5 8L7 11.5L12.5 5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
