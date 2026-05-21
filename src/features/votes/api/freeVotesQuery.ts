import { queryOptions } from "@tanstack/react-query";
// MOCK_START — 제거 시 이 줄부터 MOCK_END까지와 apiClient import를 삭제
// import { apiClient } from "@base/api/client";
// MOCK_END

export interface FreeVotesResponse {
  remainingFreeVotes: number;
  totalFreeVotes: number;
}

export const freeVotesQueryKey = ["me", "free-votes"] as const;

export const freeVotesQueryOptions = () =>
  queryOptions<FreeVotesResponse>({
    queryKey: freeVotesQueryKey,
    // MOCK_START — 제거 시 이 줄부터 MOCK_END까지 삭제 후 아래 실제 호출 주석 해제
    queryFn: () => Promise.resolve({ remainingFreeVotes: 4, totalFreeVotes: 5 }),
    // queryFn: () => apiClient.get<FreeVotesResponse>("/api/me/free-votes").then((r) => r.data),
    // MOCK_END
    staleTime: 1000 * 60 * 5,
  });
