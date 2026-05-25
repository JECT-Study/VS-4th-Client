import { defaultApi } from "@base/api/defaultApi";
import { queryOptions } from "@tanstack/react-query";
import type { VoteResult } from "../model/resultTypes";

export const voteResultQueryOptions = (voteId: string) =>
  queryOptions<VoteResult>({
    queryKey: ["votes", voteId, "result"],
    queryFn: () => defaultApi.getResult(Number(voteId)).then((r) => r.data as VoteResult),
  });
