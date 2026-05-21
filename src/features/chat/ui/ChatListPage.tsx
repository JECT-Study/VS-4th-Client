import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useChatListQuery } from "../api/chatListQuery";
import type { ChatTabType } from "../model/types";
import { ChatEmptyState } from "./ChatEmptyState";
import { ChatList } from "./ChatList";
import { ChatTabs } from "./ChatTabs";

export function ChatListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ChatTabType>("ONGOING");

  const { data, isLoading, isError } = useChatListQuery(activeTab);

  const currentItems = data?.chats ?? [];

  return (
    <main className="min-h-screen pb-20 bg-white">
      <header className="px-5 pb-4 pt-14">
        <h1 className="text-title-m text-grey-black">채팅</h1>
      </header>

      <ChatTabs activeTab={activeTab} onChangeTab={setActiveTab} />

      {isLoading && (
        <div className="py-10 text-center text-label-m text-grey-light">채팅 목록을 불러오는 중입니다.</div>
      )}

      {isError && (
        <div className="py-10 text-center text-label-m text-grey-light">채팅 목록을 불러오지 못했습니다.</div>
      )}

      {!isLoading && !isError && currentItems.length > 0 && (
        <ChatList
          items={currentItems}
          status={activeTab}
          onClickItem={(voteId) => {
            navigate({
              to: "/chat/$chatRoomId",
              params: {
                chatRoomId: String(voteId),
              },
            });
          }}
        />
      )}

      {!isLoading && !isError && currentItems.length === 0 && <ChatEmptyState />}
    </main>
  );
}
