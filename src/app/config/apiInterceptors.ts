import { apiClient } from "@base/api/client";
import { showToast } from "@base/ui/Toast";
import type { InternalAxiosRequestConfig } from "axios";
import { queryClient } from "./queryClient";
import { router } from "./router";

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{ resolve: () => void; reject: (err: unknown) => void }> = [];

function processQueue(error: unknown, success: boolean) {
  for (const { resolve, reject } of failedQueue) {
    if (success) resolve();
    else reject(error);
  }
  failedQueue = [];
}

export function setupApiInterceptors() {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as RetryableConfig;

      if (error.response?.status !== 401 || originalRequest._retry || originalRequest.url?.includes("/auth/reissue")) {
        return Promise.reject(error);
      }

      // 명백한 게스트(userQuery가 이미 null을 캐시한 상태)는 reissue 스킵
      const cachedUser = queryClient.getQueryData(["user", "me"]);
      if (cachedUser === null) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post("/auth/reissue");
        processQueue(null, true);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, false);
        if (queryClient.getQueryData(["user", "me"])) {
          queryClient.removeQueries({ queryKey: ["user"] });
          showToast.warning("세션이 만료되었어요. 다시 로그인해 주세요.");
          router.navigate({ to: "/login" });
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );
}
