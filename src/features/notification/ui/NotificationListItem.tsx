import type { NotificationItem } from "../model/types";

interface NotificationListItemProps {
    item: NotificationItem;
    onClick: () => void;
}

export function NotificationListItem({ item, onClick }: NotificationListItemProps) {
    return (
        <li className="border-b border-grey-stroke">
            <button
                type="button"
                onClick={onClick}
                className={`flex items-start justify-between w-full px-5 py-4 text-left cursor-pointer transition-colors ${
                    item.isRead ? "bg-white" : "bg-primary/5" // 읽지 않은 알림 강조
                }`}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h4 className={`text-body-l ${item.isRead ? "text-grey-dark" : "text-grey-black font-medium"}`}>
                        {item.title}
                    </h4>
                    <p className="text-body-m text-grey-dark">{item.message}</p>
                    <span className="text-label-s text-grey-light mt-1">{item.timeAgo}</span>
                </div>

                {item.thumbnailUrl && (
                    <img
                        src={item.thumbnailUrl}
                        alt="썸네일"
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                )}
            </button>
        </li>
    );
}