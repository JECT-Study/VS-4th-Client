import { queryOptions } from "@tanstack/react-query";
import type { User } from "../model/types";

export const userQueryOptions = () =>
  queryOptions<User | null>({
    queryKey: ["user", "me"],
    // MOCK_START — 제거 시 이 줄부터 MOCK_END까지 삭제 후 아래 실제 호출 주석 해제
    queryFn: () => Promise.resolve(null),
    // queryFn: async () => {
    //   try {
    //     const r = await apiClient.get<User>("/api/users/me");
    //     return r.data;
    //   } catch (err) {
    //     if (isAxiosError(err) && err.response?.status === 401) return null;
    //     throw err;
    //   }
    // },
    // MOCK_END
    staleTime: 1000 * 60 * 5,
  });
