import type { ChatVoteItem } from "../model/types";

interface ChatListItemProps {
  item: ChatVoteItem;
  onClick?: (id: number) => void;
}

export function ChatListItem({ item, onClick }: ChatListItemProps) {
  const unreadLabel = item.unreadCount && item.unreadCount >= 300 ? "300+" : item.unreadCount;

  return (
    <button
      type="button"
      onClick={() => onClick?.(item.id)}
      className="flex w-full gap-3 px-5 py-3 text-left border-b border-grey-divider"
    >
      <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-lg bg-grey-divider">
        <img src={item.thumbnailUrl} alt="" className="object-cover w-full h-full" />

        {item.status === "ended" && (
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

        <p className="mt-1 truncate text-label-s text-grey-dark">{item.description}</p>
        <p className="mt-1 truncate text-label-s text-grey-light">{item.lastMessage}</p>

        {item.status === "active" && item.remainingTime && (
          <div className="flex items-center gap-1 mt-2 text-label-s text-grey-light">
            <span>◷</span>
            <span>{item.remainingTime}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-4 shrink-0">
        <span className="text-label-s text-grey-light">{item.timeLabel}</span>

        {item.status === "active" && unreadLabel && (
          <span className="rounded-full bg-primary px-2 py-[2px] text-label-s text-white">{unreadLabel}</span>
        )}
      </div>
    </button>
  );
}
