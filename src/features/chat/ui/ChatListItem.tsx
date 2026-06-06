import { VoteTimeCountdown } from "@features/home/ui/VoteTimeCountdown";
import { formatTimeLabel } from "../lib/formatChatTime";
import type { ChatListItemResponse, ChatTabType } from "../model/types";

interface ChatListItemProps {
  item: ChatListItemResponse;
  status: ChatTabType;
  onClick?: (id: number) => void;
}

export function ChatListItem({ item, status, onClick }: ChatListItemProps) {
  const unreadLabel = item.unreadCount && item.unreadCount >= 300 ? "300+" : item.unreadCount;
  const isEnded = status === "ENDED";
  const isOngoing = status === "ONGOING";

  return (
    <button
      type="button"
      onClick={() => onClick?.(item.voteId)}
      className="flex w-full gap-3 px-5 py-3 text-left border-b border-grey-divider"
    >
      <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-lg bg-grey-divider">
        <img src={item.thumbnailUrl} alt="" className="object-cover w-full h-full" />

        {isEnded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-white text-label-l">종료</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <strong className="truncate text-label-l text-grey-black">{item.title}</strong>
          <span className="shrink-0 text-label-l text-grey-light">{item.participantCount}</span>
        </div>

        <p className="mt-1 truncate text-label-s text-grey-dark">
          {item.optionA} vs {item.optionB}
        </p>

        <p className="mt-1 truncate text-label-s text-grey-light">{item.lastMessage}</p>

        {isOngoing && (
          <div className="flex items-center gap-1 mt-2 text-label-s text-grey-light">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
              <title>남은 시간</title>
              <circle cx="8" cy="8" r="5.4" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8 5V8L10.2 10.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <VoteTimeCountdown endAt={item.endAt} />
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-4 shrink-0">
        <span className="text-label-s text-grey-light">
          {formatTimeLabel(isOngoing ? item.lastMessageAt : item.endAt)}
        </span>

        {isOngoing && !!unreadLabel && (
          <span className="rounded-full bg-primary px-2 py-[2px] text-label-s text-white">{unreadLabel}</span>
        )}
      </div>
    </button>
  );
}
