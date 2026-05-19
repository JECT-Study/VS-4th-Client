import { useParams } from "@tanstack/react-router";
import { ChatInputBar } from "./ChatInputBar";
import { ChatMessageList } from "./ChatMessageList";
import { ChatRoomHeader } from "./ChatRoomHeader";
import { VoteSummaryCard } from "./VoteSummaryCard";
import { useChatGaugeQuery } from "../hooks/useChatGaugeQuery";
import { useChatMessagesQuery } from "../hooks/useChatMessagesQuery";
import { useChatRoomHeaderQuery } from "../hooks/useChatRoomHeaderQuery";
import { useSendChatMessageMutation } from "../hooks/useSendChatMessageMutation";

export function ChatRoomPage() {
  const params = useParams({ strict: false });
  const voteId = Number(params.chatRoomId);
  const { data: header, isLoading: isHeaderLoading, isError: isHeaderError } = useChatRoomHeaderQuery(voteId);

  const {
    data: gauge,
    isLoading: isGaugeLoading,
    isError: isGaugeError,
  } = useChatGaugeQuery({
    voteId,
    status: header?.status,
  });

  const { data: messagesData, isLoading: isMessagesLoading, isError: isMessagesError } = useChatMessagesQuery(voteId);

  const sendMessageMutation = useSendChatMessageMutation(voteId);

  const isLoading = isHeaderLoading || isGaugeLoading || isMessagesLoading;
  const isError = isHeaderError || isGaugeError || isMessagesError;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="py-10 text-center text-label-m text-grey-light">채팅방을 불러오는 중입니다.</div>
      </main>
    );
  }

  if (isError || !header || !gauge || !messagesData) {
    return (
      <main className="min-h-screen bg-white">
        <div className="py-10 text-center text-label-m text-grey-light">채팅방을 불러오지 못했습니다.</div>
      </main>
    );
  }

  const isEnded = header.status === "ENDED";

  const handleSubmitMessage = (message: string) => {
    sendMessageMutation.mutate(message);
  };

  return (
    <main className="min-h-screen pb-20 bg-white">
      <ChatRoomHeader title={header.title} participantCount={gauge.participantCount} />

      <VoteSummaryCard header={header} gauge={gauge} />

      <ChatMessageList messages={messagesData.messages} optionA={header.optionA} optionB={header.optionB} />

      {isEnded ? (
        <div className="fixed left-0 right-0 text-center bottom-8 text-label-m text-grey-light">
          투표가 종료되어 채팅이 마감되었어요.
        </div>
      ) : (
        <ChatInputBar disabled={sendMessageMutation.isPending} onSubmit={handleSubmitMessage} />
      )}
    </main>
  );
}
