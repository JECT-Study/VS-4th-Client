export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  thumbnailUrl?: string; // 투표 결과 썸네일 등
  timeAgo: string;
  isRead: boolean;
}
