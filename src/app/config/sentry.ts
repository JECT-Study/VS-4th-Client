import * as Sentry from "@sentry/react";
import { isAxiosError } from "axios";

const EXPECTED_HTTP_STATUSES = new Set([401, 403]);

/**
 * 브라우저/서드파티에서 발생하는 노이즈 에러.
 * 앱 로직과 무관하며 대응할 수 없는 이벤트이므로 Sentry에 보내지 않는다.
 */
const IGNORED_ERRORS: Array<string | RegExp> = [
  "ResizeObserver loop completed with undelivered notifications",
  "ResizeObserver loop limit exceeded",
  "Non-Error promise rejection captured",
  "Non-Error exception captured",
  /^Loading chunk .+ failed/,
  /^Loading CSS chunk .+ failed/,
  "ChunkLoadError",
  "Network Error",
  "Request aborted",
  "AbortError",
  "TypeError: Failed to fetch",
  "TypeError: NetworkError when attempting to fetch resource",
  "TypeError: cancelled",
];

const DENY_URLS: RegExp[] = [
  /extensions\//i,
  /^chrome:\/\//i,
  /^chrome-extension:\/\//i,
  /^moz-extension:\/\//i,
  /^safari-extension:\/\//i,
];

const SENTRY_DSN = "";

function truncate(value: string | undefined, maxLength: number): string {
  if (!value) return "";
  return value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
}

export function isExpectedApiError(error: unknown): boolean {
  if (!isAxiosError(error)) return false;
  const status = error.response?.status;
  return status !== undefined && EXPECTED_HTTP_STATUSES.has(status);
}

export function initSentry(): void {
  Sentry.init({
    dsn: SENTRY_DSN,
    enabled: import.meta.env.PROD,
    release: "vs@1.0.0",
    environment: "production",
    sendDefaultPii: true,

    integrations: [Sentry.browserTracingIntegration()],

    tracesSampleRate: 0.2,
    tracePropagationTargets: ["localhost"],

    ignoreErrors: IGNORED_ERRORS,
    denyUrls: DENY_URLS,

    beforeSend(event, hint) {
      if (!navigator.onLine) return null;

      const error = hint?.originalException;

      if (isAxiosError(error)) {
        const status = error.response?.status;

        if (status !== undefined && EXPECTED_HTTP_STATUSES.has(status)) {
          return null;
        }

        if (status !== undefined && status >= 500) {
          event.contexts = {
            ...event.contexts,
            api: {
              url: error.config?.url,
              method: error.config?.method?.toUpperCase(),
              status,
              response_data: truncate(
                typeof error.response?.data === "string" ? error.response.data : JSON.stringify(error.response?.data),
                1000,
              ),
            },
          };
        }
      }

      return event;
    },
  });
}
