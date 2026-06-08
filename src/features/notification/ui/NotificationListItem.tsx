import type { NotificationItem } from "../model/types";

interface NotificationListItemProps {
  item: NotificationItem;
  onClick: () => void;
}

export function NotificationListItem({ item, onClick }: NotificationListItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`flex items-start justify-between w-full px-5 py-4 text-left cursor-pointer transition-colors ${
          item.isRead ? "bg-white" : "bg-primary/5" // 읽지 않은 알림 강조
        }`}
      >
        <div className="flex min-w-0 flex-col gap-1 pr-4">
          <h4 className={`truncate text-body-m ${item.isRead ? "text-grey-dark" : "font-medium text-grey-black"}`}>
            {item.body}
          </h4>
          <p className="truncate text-body-s text-grey-dark">{item.title}</p>
          <span className="mt-1 text-label-m text-grey-light">{item.timeAgo}</span>
        </div>

        {item.thumbnailUrl && (
          <img src={item.thumbnailUrl} alt="썸네일" className="flex-shrink-0 object-cover w-12 h-12 rounded-lg" />
        )}
      </button>
    </li>
  );
}
