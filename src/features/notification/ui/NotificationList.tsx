import type { NotificationItem } from "../model/types";
import { NotificationListItem } from "./NotificationListItem";

interface NotificationListProps {
  notifications: NotificationItem[];
  onReadAll: () => void;
  onClickItem: (id: number) => void;
}

export function NotificationList({ notifications, onReadAll, onClickItem }: NotificationListProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-56px)]">
        <div className="w-16 h-16 mb-4 border border-grey-dark rounded-full flex items-center justify-center">
          <img src="/assets/icons/bell.svg" alt="알림 없음" className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="text-title-m font-bold text-grey-black mb-2">아직 알림이 없어요</h3>
        <p className="text-body-m text-grey-dark text-center mb-6">
          투표에 참여하면 결과가 공개될 때<br />
          여기서 가장 먼저 알려드려요
        </p>
        <button className="flex items-center gap-1 px-4 py-2 border border-grey-divider rounded-full text-body-m font-medium">
          투표 참여하러 가기
          <img src="/assets/icons/chevron-right.svg" alt="이동" className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white">
      <div className="flex items-center justify-between px-5 py-3 border-b border-grey-stroke">
        <span className="text-body-m text-grey-dark">읽지 않은 알림 {unreadCount}개</span>
        {unreadCount > 0 && (
          <button onClick={onReadAll} className="text-body-m text-primary font-medium">
            모두 읽음
          </button>
        )}
      </div>

      <ul>
        {notifications.map((notification) => (
          <NotificationListItem
            key={notification.id}
            item={notification}
            onClick={() => onClickItem(notification.id)}
          />
        ))}
      </ul>
    </div>
  );
}
