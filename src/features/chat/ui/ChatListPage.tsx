import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { BottomTabBar } from "@/features/common/ui/BottomTabBar";

import { activeChatVotes, endedChatVotes } from "../model/mockChatData";
import type { ChatTabType } from "../model/types";
import { ChatEmptyState } from "./ChatEmptyState";
import { ChatList } from "./ChatList";
import { ChatTabs } from "./ChatTabs";

export function ChatListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ChatTabType>("active");

  const currentItems = activeTab === "active" ? activeChatVotes : endedChatVotes;

  return (
    <main className="min-h-screen pb-20 bg-white">
      <header className="px-5 pb-4 pt-14">
        <h1 className="text-title-m text-grey-black">채팅</h1>
      </header>

      <ChatTabs activeTab={activeTab} onChangeTab={setActiveTab} />

      {currentItems.length > 0 ? (
        <ChatList
          items={currentItems}
          onClickItem={(id) => {
            navigate({
              to: "/chat/$chatRoomId",
              params: {
                chatRoomId: String(id),
              },
            });
          }}
        />
      ) : (
        <ChatEmptyState />
      )}

      <BottomTabBar
        activeTab="chat"
        onClickTab={(path) => {
          navigate({ to: path });
        }}
      />
    </main>
  );
}
