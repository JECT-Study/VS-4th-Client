import { queryOptions } from "@tanstack/react-query";
import type { VoteResult } from "../model/resultTypes";
// MOCK_START — 제거 시 이 줄부터 MOCK_END까지와 mockVoteResult import를 삭제
import { mockVoteResult } from "./mockVoteResult";
// MOCK_END

export const voteResultQueryOptions = (voteId: string) =>
  queryOptions<VoteResult>({
    queryKey: ["votes", voteId, "result"],
    // MOCK_START — 제거 시 이 줄부터 MOCK_END까지 삭제 후 아래 실제 호출 주석 해제
    queryFn: () => Promise.resolve({ ...mockVoteResult, voteId: Number(voteId) }),
    // queryFn: () => apiClient.get<VoteResult>(`/api/votes/${voteId}/result`).then((r) => r.data),
    // MOCK_END
  });
