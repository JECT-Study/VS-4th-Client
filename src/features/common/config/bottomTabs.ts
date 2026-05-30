export interface BottomTabItem {
  key: "home" | "vote" | "chat" | "my";
  label: string;
  path: string;
  icon: string;
  activeIcon: string;
}

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
