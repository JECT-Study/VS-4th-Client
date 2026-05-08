import { apiClient } from "@base/api/client";
import { queryOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import type { User } from "../model/types";
// MOCK_START — 제거 시 이 줄부터 MOCK_END까지와 mockUser import를 삭제
const mockUser: User = {
  email: "test@example.com",
  nickname: "테스트유저",
  birthDate: "1998-03-15",
  gender: "FEMALE",
  imageColor: "GREEN",
  userStatus: "ACTIVE",
};
// MOCK_END

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
