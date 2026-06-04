import type { NotificationItem } from "../model/types";
import { NotificationListItem } from "./NotificationListItem";
import { Link } from "@tanstack/react-router"; // Link 컴포넌트 추가

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
                {/* 3. 알림 없음 아이콘 수정 (이미지 비율에 맞게 크기 및 여백 조정) */}
                <img
                    src="/assets/icons/no-alarm.svg"
                    alt="알림 없음"
                    className="w-[88px] h-[88px] mb-12"
                />

                <h3 className="text-h-s font-bold text-black mb-6">아직 알림이 없어요</h3>

                <p className="text-title-s text-grey-purple text-center mb-8">
                    투표에 참여하면 결과가 공개될 때<br />
                    여기서 가장 먼저 알려드려요
                </p>

                {/* 1. 몰입형 투표 경로로 이동하는 Link로 변경 */}
                {/* 2. arrow-right.svg 아이콘 적용 및 버튼 스타일 조정 */}
                <Link
                    to="/immersive-votes"
                    search={{
                          startVoteId: undefined,
                    }}
                    className="flex items-center gap-1 px-5 py-2.5 border border-grey-disabled rounded-full text-body-m text-grey-black font-medium"
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
                    <button type="button" onClick={onReadAll} className="text-body-m text-primary font-medium">
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