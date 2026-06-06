/// <reference lib="webworker" />

import { FIREBASE_WEB_APP_CONFIG } from "@base/push/firebaseWebConfig";
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope;

// ── Firebase Cloud Messaging ─────────────────────────────────

const DEFAULT_ICON = "/assets/images/logo_118x118.png";
const DEFAULT_BADGE = "/assets/images/logo_118x118.png";
const DEFAULT_NOTIFICATION_URL = "/home";

type FcmMessagePayload = {
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

type PushPayload = {
  title?: string;
  body?: string;
  redirect_url?: string;
  url?: string;
  tag?: string;
  icon?: string;
  badge?: string;
};

const isFcmPayload = (payload: unknown): payload is FcmMessagePayload => {
  if (!payload || typeof payload !== "object") return false;

  const maybeFcmPayload = payload as Record<string, unknown>;
  return "from" in maybeFcmPayload || "fcmMessageId" in maybeFcmPayload || "notification" in maybeFcmPayload;
};

const normalizeNotification = (payload: FcmMessagePayload | PushPayload) => {
  const notification = "notification" in payload ? payload.notification : undefined;
  const data = "data" in payload ? payload.data : undefined;

  return {
    title: notification?.title ?? data?.title ?? ("title" in payload ? payload.title : undefined) ?? "VS",
    body: notification?.body ?? data?.body ?? ("body" in payload ? payload.body : undefined) ?? "",
    icon: notification?.icon ?? data?.icon ?? ("icon" in payload ? payload.icon : undefined) ?? DEFAULT_ICON,
    badge: data?.badge ?? ("badge" in payload ? payload.badge : undefined) ?? DEFAULT_BADGE,
    tag: data?.tag ?? ("tag" in payload ? payload.tag : undefined),
    redirectUrl:
      data?.redirect_url ??
      data?.url ??
      ("redirect_url" in payload ? payload.redirect_url : undefined) ??
      ("url" in payload ? payload.url : undefined) ??
      ("fcmOptions" in payload ? payload.fcmOptions?.link : undefined) ??
      DEFAULT_NOTIFICATION_URL,
  };
};

const showPushNotification = (payload: FcmMessagePayload | PushPayload) => {
  const notification = normalizeNotification(payload);

  return self.registration.showNotification(notification.title, {
    body: notification.body,
    icon: notification.icon,
    badge: notification.badge,
    tag: notification.tag,
    data: { redirect_url: notification.redirectUrl },
  });
};

try {
  const firebaseApp = initializeApp(FIREBASE_WEB_APP_CONFIG);
  const messaging = getMessaging(firebaseApp);

  onBackgroundMessage(messaging, (payload) => {
    void showPushNotification(payload as FcmMessagePayload);
  });
} catch (error) {
  // Firebase 초기화 실패가 서비스 워커 설치/활성화 자체를 막으면 앱 전체 네트워크가 불안정해질 수 있다.
  console.warn("FCM 서비스 워커 초기화 실패:", error);
}

// ── Precaching ──────────────────────────────────────────────

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// ── Navigation fallback ─────────────────────────────────────

const navigationRoute = new NavigationRoute(createHandlerBoundToURL("/index.html"), {
  denylist: [/^\/api(?:\/|$)/],
});
registerRoute(navigationRoute);

// ── Runtime caching ─────────────────────────────────────────

registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  }),
);

registerRoute(
  /^https:\/\/fonts\.googleapis\.com\/.*/i,
  new CacheFirst({
    cacheName: "google-fonts-cache",
    plugins: [
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  }),
);

registerRoute(
  /^https:\/\/fonts\.gstatic\.com\/.*/i,
  new CacheFirst({
    cacheName: "gstatic-fonts-cache",
    plugins: [
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  }),
);

// ── Lifecycle ───────────────────────────────────────────────

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ── Push notification fallback ──────────────────────────────

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload: PushPayload | FcmMessagePayload;
  try {
    payload = event.data.json() as PushPayload | FcmMessagePayload;
  } catch {
    payload = {
      title: "VS",
      body: event.data.text() || "새 알림이 있습니다",
    };
  }

  // FCM payload는 firebase/messaging/sw의 onBackgroundMessage가 처리한다.
  // 여기서는 비-FCM Web Push만 fallback으로 표시한다.
  if (isFcmPayload(payload)) return;

  event.waitUntil(showPushNotification(payload));
});

// ── Notification click ──────────────────────────────────────

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const redirectUrl: string = event.notification.data?.redirect_url ?? DEFAULT_NOTIFICATION_URL;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (new URL(client.url).origin === self.location.origin) {
          client.focus();
          client.postMessage({ type: "PUSH_NOTIFICATION_CLICK", url: redirectUrl });
          return;
        }
      }

      return self.clients.openWindow(redirectUrl);
    }),
  );
});
