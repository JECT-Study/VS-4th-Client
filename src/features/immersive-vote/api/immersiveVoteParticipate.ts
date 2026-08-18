import { apiClient } from "@base/api/client";
import { getImmersiveImpressionContext, releaseImmersiveParticipateContext } from "../model/immersiveImpression";
import type { ImmersiveParticipateResponse } from "../model/types";

// 노출 계측 필드(impressionId·elapsedMs)를 실어 보내려고 생성 클라이언트 대신 apiClient를 직접 쓴다.
// 두 필드 모두 선택값이라 노출 기록 전이면 빠진 채로 나가고 서버는 기존과 동일하게 동작한다.
export const immersiveParticipate = (voteId: number, optionId: number): Promise<ImmersiveParticipateResponse> => {
  // 노출 정보는 한 노출당 한 번만 나가므로, 되돌릴지 판단하려면 이번 요청이 실제로 실었는지를 알아야 한다.
  const impression = getImmersiveImpressionContext(voteId);

  return apiClient
    .post<ImmersiveParticipateResponse>(`/api/immersive-votes/${voteId}/participate`, { optionId, ...impression })
    .then((r) => r.data)
    .catch((error) => {
      // 실었던 요청이 실패했을 때만 풀어줘 재시도가 Time to Vote를 다시 실을 수 있게 한다.
      // 빈 채로 나간 취소·재투표 요청까지 풀어주면 이미 집계된 노출이 다시 열려
      // 뒤이은 재투표에 elapsedMs가 한 번 더 실린다.
      if (impression.impressionId) releaseImmersiveParticipateContext(voteId);
      throw error;
    });
};
