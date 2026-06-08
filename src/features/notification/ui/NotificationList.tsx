import { Link } from "@tanstack/react-router";
import type { NotificationItem } from "../model/types";
import { NotificationListItem } from "./NotificationListItem";

interface NotificationListProps {
  notifications: NotificationItem[];
  onReadAll: () => void;
  onClickItem: (item: NotificationItem) => void;
}

export function NotificationList({ notifications, onReadAll, onClickItem }: NotificationListProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-56px)] bg-white">
        {/* 수정됨: mx-auto, block, object-contain 추가로 이미지 자체의 중앙 정렬 강제화 */}
        <img src="/assets/icons/no-alarm.svg" alt="알림 없음" className="block object-contain mx-auto mb-12" />

        <h3 className="mb-6 font-bold text-black text-h-s">아직 알림이 없어요</h3>

        <p className="mb-8 text-center text-title-s text-grey-purple">
          투표에 참여하면 결과가 공개될 때<br />
          여기서 가장 먼저 알려드려요
        </p>

        {/* 수정됨: justify-center 추가로 버튼 안의 텍스트와 아이콘을 정중앙으로 배치 */}
        <Link
          to="/immersive-votes"
          search={{
            startVoteId: undefined,
          }}
          className="flex items-center justify-center gap-1 px-5 py-2.5 border border-grey-disabled rounded-full text-body-m text-grey-black font-medium"
        >
          <span className="text-title-m">투표 참여하러 가기</span>
          <img src="/assets/icons/arrow-right.svg" alt="이동" className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white">
      <div className="flex items-center justify-between px-5 py-3 border-b border-grey-stroke">
        <span className="text-body-m text-grey-dark">읽지 않은 알림 {unreadCount}개</span>
        {unreadCount > 0 && (
          <button type="button" onClick={onReadAll} className="font-medium text-body-m text-primary">
            모두 읽음
          </button>
        )}
      </div>

      <ul>
        {notifications.map((notification) => (
          <NotificationListItem key={notification.id} item={notification} onClick={() => onClickItem(notification)} />
        ))}
      </ul>
    </div>
  );
}
