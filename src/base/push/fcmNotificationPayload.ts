export const DEFAULT_NOTIFICATION_ICON = "/assets/images/logo_118x118.png";
export const DEFAULT_NOTIFICATION_BADGE = "/assets/images/logo_118x118.png";
export const DEFAULT_NOTIFICATION_URL = "/home";

export type FcmMessagePayload = {
  from?: string;
  fcmMessageId?: string;
  notification?: {
    title?: string;
    body?: string;
    icon?: string;
  };
  data?: Record<string, string | undefined>;
  fcmOptions?: {
    link?: string;
  };
};

export type PushPayload = {
  title?: string;
  body?: string;
  redirect_url?: string;
  url?: string;
  tag?: string;
  icon?: string;
  badge?: string;
};

export type NormalizedPushNotification = {
  title: string;
  body: string;
  icon: string;
  badge: string;
  tag?: string;
  redirectUrl: string;
};

export const isFcmPayload = (payload: unknown): payload is FcmMessagePayload => {
  if (!payload || typeof payload !== "object") return false;

  const maybeFcmPayload = payload as Record<string, unknown>;
  return "from" in maybeFcmPayload || "fcmMessageId" in maybeFcmPayload || "notification" in maybeFcmPayload;
};

export const normalizePushNotification = (
  payload: FcmMessagePayload | PushPayload,
): NormalizedPushNotification => {
  const notification = "notification" in payload ? payload.notification : undefined;
  const data = "data" in payload ? payload.data : undefined;

  return {
    title: notification?.title ?? data?.title ?? ("title" in payload ? payload.title : undefined) ?? "VS",
    body: notification?.body ?? data?.body ?? ("body" in payload ? payload.body : undefined) ?? "",
    icon: notification?.icon ?? data?.icon ?? ("icon" in payload ? payload.icon : undefined) ?? DEFAULT_NOTIFICATION_ICON,
    badge: data?.badge ?? ("badge" in payload ? payload.badge : undefined) ?? DEFAULT_NOTIFICATION_BADGE,
    tag:
      ("fcmMessageId" in payload ? payload.fcmMessageId : undefined) ??
      data?.tag ??
      ("tag" in payload ? payload.tag : undefined),
    redirectUrl:
      data?.redirect_url ??
      data?.url ??
      ("redirect_url" in payload ? payload.redirect_url : undefined) ??
      ("url" in payload ? payload.url : undefined) ??
      ("fcmOptions" in payload ? payload.fcmOptions?.link : undefined) ??
      DEFAULT_NOTIFICATION_URL,
  };
};

/** 백그라운드에서 notification payload가 있으면 브라우저가 이미 표시한다. */
export const shouldShowBackgroundNotification = (payload: FcmMessagePayload): boolean => !payload.notification;