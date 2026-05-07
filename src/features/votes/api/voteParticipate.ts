import { apiClient } from "@base/api/client";
// MOCK_START — 제거 시 이 줄부터 MOCK_END까지와 VoteOption import를 삭제
import type { VoteOption } from "../model/types";
// MOCK_END
import type { ParticipateResponse } from "../model/types";

export const participateVote = async (voteId: string, optionId: number): Promise<ParticipateResponse> => {
  // MOCK_START — 제거 시 이 줄부터 MOCK_END까지 삭제 후 아래 실제 호출 주석 해제
  const mockOptions: VoteOption[] = [
    { optionId: 10, label: "혼밥이 편하다", voteCount: 22, ratio: 70 },
    { optionId: 11, label: "그래도 밥은 같이 먹는게 맞다", voteCount: 9, ratio: 30 },
  ];
  return Promise.resolve({
    voteId: Number(voteId),
    selectedOptionId: optionId,
    options: mockOptions,
    participantCount: 32,
    remainingFreeVotes: 3,
  });
  // return apiClient
  //   .post<ParticipateResponse>(`/api/votes/${voteId}/participate`, { optionId })
  //   .then((r) => r.data);
  // MOCK_END
};

export const cancelVote = async (voteId: string): Promise<void> => {
  // MOCK_START — 제거 시 이 줄부터 MOCK_END까지 삭제 후 아래 실제 호출 주석 해제
  return Promise.resolve();
  // return apiClient.delete(`/api/votes/${voteId}/participate`).then(() => undefined);
  // MOCK_END
};
