import { defaultApi } from "@base/api/defaultApi";
import type { ParticipateResponse } from "../model/types";

export const participateVote = (voteId: string, optionId: number): Promise<ParticipateResponse> =>
  defaultApi.participate(Number(voteId), { optionId }).then((r) => r.data as ParticipateResponse);

export const cancelVote = (voteId: string): Promise<void> =>
  defaultApi.cancel(Number(voteId)).then(() => undefined);
