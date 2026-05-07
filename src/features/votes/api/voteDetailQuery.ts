import { apiClient } from "@base/api/client";
import { queryOptions } from "@tanstack/react-query";
import type { VoteDetail } from "../model/types";
// MOCK_START — 제거 시 이 줄부터 MOCK_END까지와 mockVoteDetail import를 삭제
import { mockVoteDetail } from "./mockVoteDetail";
// MOCK_END

export const voteDetailQueryOptions = (voteId: string) =>
  queryOptions<VoteDetail>({
    queryKey: ["votes", voteId],
    // MOCK_START — 제거 시 이 줄부터 MOCK_END까지 삭제 후 아래 실제 호출 주석 해제
    queryFn: () => Promise.resolve({ ...mockVoteDetail, voteId: Number(voteId) }),
    // queryFn: () => apiClient.get<VoteDetail>(`/api/votes/${voteId}`).then((r) => r.data),
    // MOCK_END
  });
