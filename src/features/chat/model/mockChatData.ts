import type { ChatGaugeResponse, ChatListItemResponse, ChatMessagesResponse, ChatRoomHeaderResponse } from "./types";

// 1. 진행 중인 채팅 목록 (ChatListItemResponse 규격 적용)
export const activeChatVotes: ChatListItemResponse[] = [
  {
    voteId: 7,
    title: "직장인 점심시간 혼밥 vs...",
    thumbnailUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120&auto=format&fit=crop",
    optionA: "혼밥이 편하다",
    optionB: "그래도 밥은 같이 먹는...",
    participantCount: 23,
    lastMessage: "팀끼리먹는다거나 친한 사람이랑만 먹을수있는 분...",
    lastMessageAt: "19:51", // 예전 timeLabel
    endAt: "2026-05-21T23:59:59Z", // 예전 remainingTime 대신 실제 날짜 포맷 사용
    unreadCount: 51,
  },
  {
    voteId: 8,
    title: "공부 장소 어디가 제일 집중...",
    thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=120&auto=format&fit=crop",
    optionA: "집",
    optionB: "독서실",
    participantCount: 8,
    lastMessage: "쉬는 공간이랑 공부하는 공간을 분리하는게 좋더...",
    lastMessageAt: "15:10",
    endAt: "2026-05-21T15:42:19Z",
    unreadCount: 15,
  },
];

// 2. 종료된 채팅 목록
export const endedChatVotes: ChatListItemResponse[] = [
  {
    voteId: 9,
    title: "소개팅 전 SNS 체크하기",
    thumbnailUrl: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=120&auto=format&fit=crop",
    optionA: "찬성",
    optionB: "반대",
    participantCount: 23,
    lastMessage: "팀끼리먹는다거나 친한 사람이랑만 먹을수있는 분...",
    lastMessageAt: "2026-04-20T12:00:00Z",
    endAt: "2026-04-20T00:00:00Z",
    unreadCount: 0,
  },
];

// 3. 채팅방 상세 - 헤더 정보 (ChatRoomHeaderResponse 규격 적용)
export const mockChatRoomHeader: ChatRoomHeaderResponse = {
  voteId: 7,
  title: "올해 물가가 더 오를까요 안 오를...",
  status: "ONGOING",
  participantCount: 25,
  optionA: "오른다",
  optionB: "떨어진다",
  endAt: "2026-05-21T23:59:59Z",
};

// 4. 채팅방 상세 - 게이지 바 정보 (ChatGaugeResponse 규격 적용)
export const mockChatGauge: ChatGaugeResponse = {
  optionARatio: 64,
  optionBRatio: 36,
  participantCount: 25,
};

// 5. 채팅방 상세 - 메시지 목록 (ChatMessagesResponse 규격 적용)
export const mockChatMessages: ChatMessagesResponse = {
  hasNext: false,
  nextCursor: null,
  messages: [
    {
      messageId: 1,
      content: "저는 내릴 거라고 봐요 정부에서 물가 안정화 정책 많이 내놓고 있잖나요",
      sentAt: "14:15",
      senderNickname: "초원 위의 말_45",
      senderProfileIcon: "default-icon.png",
      senderVoteOption: "B", // 떨어진다 (Option B)
      isMine: false,
    },
    {
      messageId: 2,
      content: "맞아요 국제 유가도 계속 오르는 추세고",
      sentAt: "14:16",
      senderNickname: "초원 위의 양_764",
      senderProfileIcon: "default-icon.png",
      senderVoteOption: "A", // 오른다 (Option A)
      isMine: false,
    },
    {
      messageId: 4,
      content: "그래도 희망을 가져봐요!",
      sentAt: "14:17",
      senderNickname: "나",
      senderProfileIcon: "my-icon.png",
      senderVoteOption: "A",
      isMine: true,
    },
  ],
};
