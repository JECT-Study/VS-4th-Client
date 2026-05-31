export interface NotificationItem {
  id: number;
  notificationId: number;
  voteId: number;
  type: "VOTE_ENDED";
  title: string;
  message: string;
  body: string;
  thumbnailUrl?: string;
  timeAgo: string;
  createdAt: string;
  isRead: boolean;
}

export interface NotificationListResponse {
  notifications: NotificationItem[];
  nextCursor: number | null;
  hasNext: boolean;
}
