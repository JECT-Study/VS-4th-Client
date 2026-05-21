import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { NotificationItem } from "../model/types";
import { NotificationList } from "./NotificationList";

// TODO: API 연결 전 임시 목업 데이터
const MOCK_NOTIFICATIONS: NotificationItem[] = [
    {
        id: 1,
        title: "주 4일 근무제 도입, 찬성 vs 반대",
        message: "투표 결과가 공개됐어요",
        timeAgo: "2시간 전",
        isRead: false,
        thumbnailUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    },
    {
        id: 2,
        title: "애인 폰 몰래 보기 가능?",
        message: "투표 결과가 공개됐어요",
        timeAgo: "3시간 전",
        isRead: false,
        thumbnailUrl: "https://images.unsplash.com/photo-1511367461989-f85a21fda167",
    },
    {
        id: 3,
        title: "나만 sns 맞팔 안해주는 친구",
        message: "투표 결과가 공개됐어요",
        timeAgo: "3일 전",
        isRead: true,
        thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    },
];

export function NotificationPage() {
    const navigate = useNavigate();
    // 실제 구현 시 useQuery 등을 통해 데이터를 가져오고 상태를 관리합니다.
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    const handleReadAll = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    const handleClickItem = (id: number) => {
        // 1. 해당 알림 읽음 처리 (API 호출)
        setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
        // 2. 해당 투표 결과 페이지로 이동
        console.log(`Maps to vote result: ${id}`);
    };

    return (
        <main className="min-h-dvh bg-white flex flex-col">
            {/* 마이페이지 등에서 사용한 공통 Header 컴포넌트가 있다면 재사용하는 것이 좋습니다. */}
            <header className="sticky top-0 z-20 flex items-center px-5 h-14 bg-white border-b border-grey-stroke">
                <button onClick={() => navigate({ to: "/" })} className="p-2 -ml-2">
                    <img src="/assets/icons/chevron-left.svg" alt="뒤로가기" className="w-6 h-6" />
                </button>
                <h1 className="text-title-m font-bold ml-2">알림</h1>
            </header>

            <div className="flex-1 overflow-y-auto pb-20">
                <NotificationList
                    notifications={notifications}
                    onReadAll={handleReadAll}
                    onClickItem={handleClickItem}
                />
            </div>
        </main>
    );
}