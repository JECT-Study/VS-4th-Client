import { defaultApi } from "@base/api/defaultApi";
import { queryOptions } from "@tanstack/react-query";
import type { VoteDetail } from "../model/types";

export const voteDetailQueryOptions = (voteId: string) =>
  queryOptions<VoteDetail>({
    queryKey: ["votes", voteId],
    queryFn: () => defaultApi.getDetail(Number(voteId)).then((r) => r.data as VoteDetail),
  });
