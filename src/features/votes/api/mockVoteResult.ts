import type { VoteResult } from "../model/resultTypes";

export const mockVoteResult: VoteResult = {
  voteId: 1,
  title: "직장인 점심시간 혼밥 vs 같이 먹기",
  createdAt: "2026-04-14T13:49:00+09:00",
  content:
    "저는 혼자 밥 먹는 게 편한데 회사에서 막내라 혼자 밥 먹겠다고 하기 눈치보여요ㅠㅠ 혼밥하고 싶다고 말씀드려도 될까요?",
  thumbnailUrl: "https://picsum.photos/400/250",
  status: "ENDED",
  endAt: "2026-04-14T23:59:00+09:00",
  participantCount: 520,
  result: {
    options: [
      { optionId: 10, label: "혼밥이 편하다", voteCount: 364, ratio: 70 },
      { optionId: 11, label: "그래도 밥은 같이 먹는게 맞다", voteCount: 156, ratio: 30 },
    ],
  },
  myVote: { voted: true, selectedOptionId: 11 },
  insight: {
    locked: false,
    scope: "MY_SELECTION",
    selectionCount: 156,
    genderDistribution: {
      female: { count: 96, ratio: 62 },
      male: { count: 60, ratio: 38 },
    },
    ageDistribution: [
      { ageGroup: "20s", ratio: 28, isMyGroup: true },
      { ageGroup: "30s", ratio: 52, isMyGroup: false },
      { ageGroup: "40s", ratio: 20, isMyGroup: false },
    ],
  },
  aiInsight: {
    available: true,
    headline: '20대 여성 그룹에서 "같이 밥먹기"를 선택한 비율이 71%로 가장 높게 나타났어요.',
    body: "MZ 세대를 중심으로 혼밥 문화가 확산되는 트렌드가 반영된 결과예요.",
  },
};
