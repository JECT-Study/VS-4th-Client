import { isExpectedApiError } from "@app/config/sentry";
import * as Sentry from "@sentry/react";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error) => {
        if (isAxiosError(error)) {
          if (error.code === "ERR_CANCELED") return false;
          if (error.response?.status && error.response.status < 500) return false;
        }
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
      networkMode: "online",
    },
    mutations: {
      networkMode: "online",
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      const status = isAxiosError(error) ? error.response?.status : undefined;

      Sentry.addBreadcrumb({
        category: "query",
        message: `Query failed: ${JSON.stringify(query.queryKey)}`,
        level: "error",
        data: { queryKey: query.queryKey, status },
      });

      if (!isExpectedApiError(error)) {
        Sentry.captureException(error, {
          tags: { source: "query" },
          extra: { queryKey: query.queryKey, status },
        });
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      const mutationKey = mutation.options.mutationKey ?? "unknown";

      Sentry.addBreadcrumb({
        category: "mutation",
        message: `Mutation failed: ${JSON.stringify(mutationKey)}`,
        level: "error",
        data: { mutationKey, status },
      });

      if (!isExpectedApiError(error)) {
        Sentry.captureException(error, {
          tags: { source: "mutation" },
          extra: { mutationKey, status },
        });
      }
    },
  }),
});
