import { defaultApi } from "@base/api/defaultApi";
import type { ImmersiveParticipateResponse } from "../model/types";

export const immersiveParticipate = (voteId: number, optionId: number): Promise<ImmersiveParticipateResponse> =>
  defaultApi.participateOrCancel(voteId, { optionId }).then((r) => r.data as ImmersiveParticipateResponse);
