import type { ImmersiveFeedItem } from "../model/types";

const futureEndAt = (hours: number) => new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

export const mockImmersiveVotes: ImmersiveFeedItem[] = [
  {
    voteId: 101,
    title: "논쟁 끝판왕 밸런스게임",
    content:
      "자기 전에 갑자기 생각난 밸런스 게임인데 한 번 골라봐. 친구들한테 물어봤는데도 의견이 엄청 갈리더라. 꼭 하나를 선택해야 한다면 전자랑 후자 중에 뭐 고를래?",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
    status: "ONGOING",
    endAt: futureEndAt(21),
    participantCount: 132,
    options: [
      { optionId: 1001, label: "스윙칩만 3달 먹기", voteCount: null, ratio: null },
      { optionId: 1002, label: "스윙스한테 30만원 주기", voteCount: null, ratio: null },
    ],
    myVote: { voted: false, selectedOptionId: null },
    emojiSummary: { LIKE: 21, SAD: 3, ANGRY: 8, WOW: 36, total: 68 },
    myEmoji: null,
    commentCount: 27,
    currentViewerCount: 14,
  },
  {
    voteId: 102,
    title: "점심시간 혼밥 가능?",
    content: "회사에서 다 같이 먹는 분위기인데 오늘은 혼자 조용히 먹고 싶어. 막내가 먼저 혼밥하겠다고 말해도 괜찮을까?",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    status: "ONGOING",
    endAt: futureEndAt(7),
    participantCount: 89,
    options: [
      { optionId: 2001, label: "혼밥이 편하다", voteCount: null, ratio: null },
      { optionId: 2002, label: "그래도 같이 먹기", voteCount: null, ratio: null },
    ],
    myVote: { voted: false, selectedOptionId: null },
    emojiSummary: { LIKE: 12, SAD: 5, ANGRY: 2, WOW: 18, total: 37 },
    myEmoji: null,
    commentCount: 11,
    currentViewerCount: 9,
  },
  {
    voteId: 103,
    title: "약속 시간 10분 전 취소",
    content:
      "친구가 약속 장소 근처까지 왔는데 갑자기 컨디션이 안 좋다고 집에 간대. 이해할 수 있다와 그래도 서운하다 중 어디에 가까워?",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    status: "ONGOING",
    endAt: futureEndAt(12),
    participantCount: 204,
    options: [
      { optionId: 3001, label: "이해할 수 있다", voteCount: null, ratio: null },
      { optionId: 3002, label: "그래도 서운하다", voteCount: null, ratio: null },
    ],
    myVote: { voted: false, selectedOptionId: null },
    emojiSummary: { LIKE: 18, SAD: 16, ANGRY: 6, WOW: 9, total: 49 },
    myEmoji: null,
    commentCount: 43,
    currentViewerCount: 22,
  },
];
