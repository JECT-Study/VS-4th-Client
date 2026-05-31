import { defaultApi } from "@base/api/defaultApi";
import { queryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { NotificationItem, NotificationListResponse } from "../model/types";

const NOTIFICATION_PAGE_SIZE = 20;

type ApiNotificationItem = NonNullable<Awaited<ReturnType<typeof defaultApi.getList>>["data"]["notifications"]>[number];

export const notificationListQueryKey = ["notifications", "list"] as const;
export const notificationUnreadCountQueryKey = ["notifications", "unread-count"] as const;

const formatRelativeTime = (isoDate?: string) => {
  if (!isoDate) return "";

  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 1000 / 60));

  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}일 전`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks}주 전`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}개월 전`;

  return `${Math.floor(diffDays / 365)}년 전`;
};

const toNotificationItem = (item: ApiNotificationItem): NotificationItem => ({
  id: item.notificationId ?? 0,
  notificationId: item.notificationId ?? 0,
  voteId: item.voteId ?? 0,
  type: item.type ?? "VOTE_ENDED",
  title: item.title ?? "",
  message: item.body ?? "",
  body: item.body ?? "",
  thumbnailUrl: item.thumbnailUrl,
  timeAgo: formatRelativeTime(item.createdAt),
  createdAt: item.createdAt ?? "",
  isRead: item.isRead ?? false,
});

export const getNotificationList = async ({
  cursor,
  size = NOTIFICATION_PAGE_SIZE,
}: { cursor?: number; size?: number }) => {
  const { data } = await defaultApi.getList(cursor, size);

  return {
    notifications: (data.notifications ?? []).map(toNotificationItem),
    nextCursor: data.nextCursor ?? null,
    hasNext: data.hasNext ?? false,
  } satisfies NotificationListResponse;
};

export const notificationUnreadCountQueryOptions = () =>
  queryOptions({
    queryKey: notificationUnreadCountQueryKey,
    queryFn: async () => {
      const { data } = await defaultApi.getUnreadCount();
      return data.unreadCount ?? 0;
    },
  });

export const useNotificationUnreadCountQuery = (enabled = true) => {
  return useQuery({
    ...notificationUnreadCountQueryOptions(),
    enabled,
  });
};

export const useNotificationListQuery = (enabled = true) => {
  return useInfiniteQuery({
    queryKey: notificationListQueryKey,
    queryFn: ({ pageParam }) => getNotificationList({ cursor: pageParam }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
    enabled,
  });
};
