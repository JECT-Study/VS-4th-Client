import { queryOptions } from "@tanstack/react-query";
import type { ImmersiveShareResponse } from "../model/types";

export const immersiveShareQueryKey = (voteId: number) => ["immersive-votes", voteId, "share"] as const;

export const immersiveShareQueryOptions = (voteId: number) =>
  queryOptions<ImmersiveShareResponse>({
    queryKey: immersiveShareQueryKey(voteId),
    // MOCK_START — 제거 시 이 줄부터 MOCK_END까지 삭제 후 아래 실제 호출 주석 해제
    queryFn: () =>
      Promise.resolve({
        shareUrl: `${window.location.origin}/poll/${voteId}`,
        title: "몰입형 투표",
        thumbnailUrl: null,
      }),
    // queryFn: () =>
    //   apiClient
    //     .get<ImmersiveShareResponse>(`/api/immersive-votes/${voteId}/share`)
    //     .then((r) => r.data),
    // MOCK_END
    staleTime: 1000 * 60 * 5,
  });
