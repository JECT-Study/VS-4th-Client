import { useNavigate, useSearch } from "@tanstack/react-router";
import { useChatListQuery } from "../api/chatListQuery";
import type { ChatTabType } from "../model/types";
import { ChatAccessGate } from "./ChatAccessRequiredPage";
import { ChatEmptyState } from "./ChatEmptyState";
import { ChatList } from "./ChatList";
import { ChatTabs } from "./ChatTabs";

export function ChatListPage() {
  return (
    <ChatAccessGate>
      <ChatListContent />
    </ChatAccessGate>
  );
}

function ChatListContent() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/chat/" });
  const activeTab: ChatTabType = search.tab === "ENDED" ? "ENDED" : "ONGOING";

  const { data, isLoading, isError } = useChatListQuery(activeTab);

  const currentItems = data?.chats ?? [];
  const handleChangeTab = (tab: ChatTabType) => {
    navigate({
      to: "/chat",
      search: { tab },
      replace: true,
    });
  };

  return (
    <main className="min-h-screen pb-20 bg-white">
      <header className="px-5 py-4">
        <h1 className="text-title-m text-grey-black">채팅</h1>
      </header>

      <ChatTabs activeTab={activeTab} onChangeTab={handleChangeTab} />

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
              search: {
                tab: activeTab,
              },
            });
          }}
        />
      )}

      {!isLoading && !isError && currentItems.length === 0 && <ChatEmptyState />}
    </main>
  );
}
