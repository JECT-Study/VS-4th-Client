/// <reference lib="webworker" />

import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope;

// ── Precaching ──────────────────────────────────────────────

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// ── Navigation fallback ─────────────────────────────────────

const navigationRoute = new NavigationRoute(createHandlerBoundToURL("/index.html"), {
  denylist: [],
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

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ── Push notification ───────────────────────────────────────

interface PushPayload {
  title: string;
  body?: string;
  redirect_url?: string;
  url?: string;
  tag?: string;
  icon?: string;
  badge?: string;
}

const DEFAULT_ICON = "/assets/images/app/pwa-192x192.png";
const DEFAULT_BADGE = "/assets/images/app/pwa-192x192.png";

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload: PushPayload;
  try {
    payload = event.data.json() as PushPayload;
  } catch {
    payload = {
      title: "VS",
      body: event.data.text() || "새 알림이 있습니다",
    };
  }

  const redirectUrl = payload.redirect_url ?? "/";

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body ?? "",
      icon: payload.icon ?? DEFAULT_ICON,
      badge: payload.badge ?? DEFAULT_BADGE,
      tag: payload.tag,
      data: { redirect_url: redirectUrl },
    }),
  );
});

// ── Notification click ──────────────────────────────────────

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const redirectUrl: string = event.notification.data?.redirect_url ?? "/";

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
