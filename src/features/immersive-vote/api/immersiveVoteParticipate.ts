// MOCK_START — 제거 시 이 줄부터 MOCK_END까지와 VoteOption import를 삭제
import type { VoteOption } from "../model/types";
// MOCK_END
import type { ImmersiveParticipateResponse } from "../model/types";

export const immersiveParticipate = async (voteId: number, optionId: number): Promise<ImmersiveParticipateResponse> => {
  // MOCK_START — 제거 시 이 줄부터 MOCK_END까지 삭제 후 아래 실제 호출 주석 해제
  const mockOptions: VoteOption[] = [
    { optionId, label: "옵션 A", voteCount: 100, ratio: 76 },
    { optionId: optionId + 1, label: "옵션 B", voteCount: 32, ratio: 24 },
  ];
  return Promise.resolve({
    voteId,
    action: "VOTED",
    selectedOptionId: optionId,
    options: mockOptions,
    remainingFreeVotes: 3,
  });
  // return apiClient
  //   .post<ImmersiveParticipateResponse>(`/api/immersive-votes/${voteId}/participate`, { optionId })
  //   .then((r) => r.data);
  // MOCK_END
};
