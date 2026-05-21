import { apiClient } from "@base/api/client";
import { queryOptions } from "@tanstack/react-query";
import type { ImmersiveShareResponse } from "../model/types";

export const immersiveShareQueryKey = (voteId: number) => ["immersive-votes", voteId, "share"] as const;

export const immersiveShareQueryOptions = (voteId: number) =>
  queryOptions<ImmersiveShareResponse>({
    queryKey: immersiveShareQueryKey(voteId),
    queryFn: () => apiClient.get<ImmersiveShareResponse>(`/api/immersive-votes/${voteId}/share`).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });
