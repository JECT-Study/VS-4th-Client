import { queryOptions } from "@tanstack/react-query";
import type { ImmersiveFeedItem } from "../model/types";
// MOCK_START — 제거 시 이 줄부터 MOCK_END까지와 mockImmersiveVotes import를 삭제
import { mockImmersiveVotes } from "./mockImmersiveData";
// MOCK_END

export interface ImmersiveFeedResponse {
  votes: ImmersiveFeedItem[];
  nextCursor: number | null;
  hasNext: boolean;
}

export const immersiveFeedQueryKey = ["immersive-votes", "feed"] as const;

export const immersiveFeedQueryOptions = (cursor?: number) =>
  queryOptions<ImmersiveFeedResponse>({
    queryKey: cursor ? [...immersiveFeedQueryKey, cursor] : immersiveFeedQueryKey,
    // MOCK_START — 제거 시 이 줄부터 MOCK_END까지 삭제 후 아래 실제 호출 주석 해제
    queryFn: () => Promise.resolve({ votes: mockImmersiveVotes, nextCursor: null, hasNext: false }),
    // queryFn: () =>
    //   apiClient
    //     .get<ImmersiveFeedResponse>("/api/immersive-votes", {
    //       params: { ...(cursor ? { cursor } : {}), size: 10 },
    //     })
    //     .then((r) => r.data),
    // MOCK_END
    staleTime: 1000 * 60 * 2,
  });
