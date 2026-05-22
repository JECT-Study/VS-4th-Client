import { defaultApi } from "@base/api/defaultApi";
import { queryOptions } from "@tanstack/react-query";
import type { ImmersiveShareResponse } from "../model/types";

export const immersiveShareQueryKey = (voteId: number) => ["immersive-votes", voteId, "share"] as const;

export const immersiveShareQueryOptions = (voteId: number) =>
  queryOptions<ImmersiveShareResponse>({
    queryKey: immersiveShareQueryKey(voteId),
    queryFn: () => defaultApi.getShareLink1(voteId).then((r) => r.data as ImmersiveShareResponse),
    staleTime: 1000 * 60 * 5,
  });
