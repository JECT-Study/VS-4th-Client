import type { EmojiResponse } from "@features/votes/model/types";
// MOCK_START — 제거 시 이 줄부터 MOCK_END까지와 EmojiType import를 삭제
import type { EmojiType } from "../model/types";
// MOCK_END

export const immersiveReactEmoji = async (_voteId: number, emoji: EmojiType | null): Promise<EmojiResponse> => {
  // MOCK_START — 제거 시 이 줄부터 MOCK_END까지 삭제 후 아래 실제 호출 주석 해제
  return Promise.resolve({
    emojiSummary: { LIKE: 21, SAD: 3, ANGRY: 8, WOW: emoji === "WOW" ? 37 : 36, total: 69 },
    myEmoji: emoji,
  });
  // return apiClient
  //   .put<EmojiResponse>(`/api/immersive-votes/${_voteId}/emoji`, { emoji })
  //   .then((r) => r.data);
  // MOCK_END
};
