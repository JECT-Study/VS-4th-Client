import { apiClient } from "@base/api/client";
import type { ImmersiveParticipateResponse } from "../model/types";

export const immersiveParticipate = async (voteId: number, optionId: number): Promise<ImmersiveParticipateResponse> =>
  apiClient
    .post<ImmersiveParticipateResponse>(`/api/immersive-votes/${voteId}/participate`, { optionId })
    .then((r) => r.data);
