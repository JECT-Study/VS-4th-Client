import type { VoteDetail } from "../model/types";

export const mockVoteDetail: VoteDetail = {
  voteId: 1,
  title: "직장인 점심시간 혼밥 vs 같이 먹기",
  createdAt: "2026-04-14T13:49:00+09:00",
  content:
    "저는 혼자 밥 먹는 게 편한데 회사에서 막내라 혼자 밥 먹겠다고 하기 눈치보여요ㅠㅠ 혼밥하고 싶다고 말씀드려도 될까요?",
  thumbnailUrl: "https://picsum.photos/400/250",
  status: "ONGOING",
  endAt: "2026-06-30T23:59:00+09:00",
  participantCount: 31,
  options: [
    { optionId: 10, label: "혼밥이 편하다", voteCount: null, ratio: null },
    { optionId: 11, label: "그래도 밥은 같이 먹는게 맞다", voteCount: null, ratio: null },
  ],
  myVote: {
    voted: false,
    selectedOptionId: null,
  },
  emojiSummary: { LIKE: 21, SAD: 3, ANGRY: 8, WOW: 36 },
  myEmoji: "WOW",
  commentCount: 81,
};
