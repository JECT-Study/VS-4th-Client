import { chatRoomDetail } from "../model/mockChatData";
import { ChatInputBar } from "./ChatInputBar";
import { ChatMessageList } from "./ChatMessageList";
import { ChatRoomHeader } from "./ChatRoomHeader";
import { VoteSummaryCard } from "./VoteSummaryCard";

export function ChatRoomPage() {
  const room = chatRoomDetail;
  const isEnded = room.status === "ended";

  return (
    <main className="min-h-screen pb-20 bg-white">
      <ChatRoomHeader title={room.title} participantCount={room.participantCount} />
      <VoteSummaryCard room={room} />
      <ChatMessageList messages={room.messages} />

      {isEnded ? (
        <div className="fixed left-0 right-0 text-center bottom-8 text-label-m text-grey-light">
          투표가 종료되어 채팅이 마감되었어요.
        </div>
      ) : (
        <ChatInputBar />
      )}
    </main>
  );
}
