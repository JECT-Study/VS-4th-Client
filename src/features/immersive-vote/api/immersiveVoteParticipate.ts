import { apiClient } from "@base/api/client";
import { getImmersiveImpressionContext } from "../model/immersiveImpression";
import type { ImmersiveParticipateResponse } from "../model/types";

// 노출 계측 필드(impressionId·elapsedMs)를 실어 보내려고 생성 클라이언트 대신 apiClient를 직접 쓴다.
// 두 필드 모두 선택값이라 노출 기록 전이면 빠진 채로 나가고 서버는 기존과 동일하게 동작한다.
export const immersiveParticipate = (voteId: number, optionId: number): Promise<ImmersiveParticipateResponse> =>
  apiClient
    .post<ImmersiveParticipateResponse>(`/api/immersive-votes/${voteId}/participate`, {
      optionId,
      ...getImmersiveImpressionContext(voteId),
    })
    .then((r) => r.data);
