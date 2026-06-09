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
            // pb-20을 추가하여 정중앙보다는 시각적으로 살짝 위쪽에 배치되도록 안정감을 주었습니다.
            <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-56px)] bg-white pb-20">
                {/* 아이콘 크기를 명시적으로 잡아주고, 하단 여백을 디자인에 맞게 줄였습니다 (mb-12 -> mb-8) */}
                <img
                    src="/assets/icons/no-alarm.svg"
                    alt="알림 없음"
                    className="block object-contain mb-8"
                />

                {/* 타이틀과 설명 텍스트 사이의 간격을 좁혔습니다 (mb-6 -> mb-4) */}
                <h3 className="mb-4 font-bold text-black text-h-s">아직 알림이 없어요</h3>

                {/* 설명 텍스트와 버튼 사이의 간격을 넓히고 줄간격(leading-relaxed)을 추가했습니다 */}
                <p className="mb-10 text-center text-title-s text-grey-purple leading-relaxed">
                    투표에 참여하면 결과가 공개될 때<br />
                    여기서 가장 먼저 알려드려요
                </p>

                {/* 버튼의 좌우 패딩을 넉넉하게(px-6, py-3) 주어 이미지와 비슷한 비율로 맞췄습니다 */}
                <Link
                    to="/immersive-votes"
                    search={{
                        startVoteId: undefined,
                    }}
                    className="flex items-center justify-center gap-1 px-6 py-3 border border-grey-disabled rounded-full"
                >
                    <span className="text-title-m text-grey-black font-medium">투표 참여하러 가기</span>
                    <img src="/assets/icons/arrow-right.svg" alt="이동" className="w-5 h-5" />
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