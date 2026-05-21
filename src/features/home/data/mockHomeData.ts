import type { BottomTabItem, VoteItem } from "../types/home";

export const todayRecommendations: VoteItem[] = [
  {
    id: 1,
    title: "뭐가 더 싫어?",
    description: "풀메했는데 약속 취소 vs 쌩얼인데 갑자기 보자함",
    thumbnailUrl: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&auto=format&fit=crop",
    remainingTime: "13:01:55",
    participantCount: 86,
    viewCount: 130,
    status: "active",
  },
  {
    id: 2,
    title: "대기업 무급 인턴",
    description: "스펙은 좋아지는데 당장 돈은 안 들어오고...",
    thumbnailUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&auto=format&fit=crop",
    remainingTime: "15:42:45",
    participantCount: 92,
    viewCount: 170,
    status: "active",
  },
  {
    id: 3,
    title: "헬스장 PT 등록할까 말까",
    description: "혼자 하면 작심삼일인데 PT는 너무 비싸고...",
    thumbnailUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop",
    remainingTime: "12:11:51",
    participantCount: 51,
    viewCount: 90,
    status: "active",
  },
];

export const hotTopicVotes: VoteItem[] = [
  {
    id: 4,
    title: "출근 1시간 거리 연봉 500 더",
    description: "연봉 UP vs 가까운 곳",
    thumbnailUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&auto=format&fit=crop",
    remainingTime: "05:14:24",
    participantCount: 114,
    viewCount: 300,
    status: "active",
  },
  {
    id: 5,
    title: "자격증 공부",
    description: "독학 vs 인강",
    thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop",
    remainingTime: "03:57:46",
    participantCount: 89,
    viewCount: 220,
    status: "active",
  },
  {
    id: 6,
    title: "친구 연애상담 어디까지 들어주나",
    description: "다 들어줌 vs 선 있음",
    thumbnailUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&auto=format&fit=crop",
    remainingTime: "11:42:32",
    participantCount: 77,
    viewCount: 190,
    status: "active",
  },
];

const baseAllVotes: VoteItem[] = [
  {
    id: 7,
    title: "직장인 점심시간 혼밥 vs 같이 먹기",
    description: "저는 혼자 밥 먹는 게 편한데 회사에서 막내라 눈치보여요.",
    thumbnailUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop",
    remainingTime: "23:47:21",
    participantCount: 102,
    viewCount: 250,
    status: "active",
  },
  {
    id: 8,
    title: "공부 장소 어디가 제일 집중 잘 돼?",
    description: "자격증 준비하는데 혼자 공부 안되는 사람 손",
    thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop",
    remainingTime: "15:42:44",
    participantCount: 89,
    viewCount: 210,
    status: "active",
  },
  {
    id: 9,
    title: "소개팅 전 SNS 체크하기",
    description: "미리 알고 가는 게 나을까 아니면 직접 만나서 알아가는 게 나을까",
    thumbnailUrl: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=600&auto=format&fit=crop",
    remainingTime: "00:00:00",
    participantCount: 63,
    viewCount: 180,
    status: "ended",
  },
  {
    id: 10,
    title: "대기업 무급 인턴",
    description: "스펙은 좋아지는데 당장 돈은 안 들어오고 너희라면?",
    thumbnailUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop",
    remainingTime: "15:42:06",
    participantCount: 120,
    viewCount: 340,
    status: "active",
  },
  {
    id: 11,
    title: "연봉은 비슷한데 야근 많은 대기업",
    description: "야근 빈도가 완전 다름. 10년 뒤를 생각하면?",
    thumbnailUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop",
    remainingTime: "15:42:07",
    participantCount: 97,
    viewCount: 260,
    status: "active",
  },
  {
    id: 12,
    title: "헬스장 PT 등록할까 말까",
    description: "혼자 하면 작심삼일인데 PT는 너무 비싸고...",
    thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop",
    remainingTime: "12:11:51",
    participantCount: 55,
    viewCount: 150,
    status: "active",
  },
];

function getBaseVote(index: number) {
  const baseVote = baseAllVotes[index % baseAllVotes.length];

  if (!baseVote) {
    throw new Error("baseAllVotes is empty");
  }

  return baseVote;
}

export const allVotes: VoteItem[] = Array.from({ length: 36 }, (_, index) => {
  const baseVote = getBaseVote(index);

  return {
    ...baseVote,
    id: index + 7,
    title: `${baseVote.title} ${index + 1}`,
    description: `${baseVote.description} (${index + 1})`,
    thumbnailUrl: `https://picsum.photos/160/160?random=${index + 1}`,
    remainingTime: index % 5 === 0 ? "00:00:00" : baseVote.remainingTime,
    participantCount: baseVote.participantCount + index * 3,
    viewCount: (baseVote.viewCount ?? 0) + index * 7,
    status: index % 5 === 0 ? "ended" : "active",
  };
});

export const bottomTabs: BottomTabItem[] = [
  {
    key: "home",
    label: "홈",
    path: "/home",
    icon: "/assets/icons/home.svg",
    activeIcon: "/assets/icons/home-active.svg",
  },
  {
    key: "vote",
    label: "몰입형 투표",
    path: "/immersive-votes",
    icon: "/assets/icons/vote.svg",
    activeIcon: "/assets/icons/vote-active.svg",
  },
  {
    key: "chat",
    label: "채팅",
    path: "/chat",
    icon: "/assets/icons/chat.svg",
    activeIcon: "/assets/icons/chat-active.svg",
  },
  {
    key: "my",
    label: "마이",
    path: "/mypage",
    icon: "/assets/icons/my.svg",
    activeIcon: "/assets/icons/my-active.svg",
  },
];
