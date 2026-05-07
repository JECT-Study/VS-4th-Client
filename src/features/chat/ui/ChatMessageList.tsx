import type { ChatMessage } from "../model/types";

interface ChatMessageListProps {
  messages: ChatMessage[];
}

export function ChatMessageList({ messages }: ChatMessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center px-5 text-center">
        <h2 className="text-title-m text-grey-black">첫 번째 메시지를 남겨보세요!</h2>
        <p className="mt-4 whitespace-pre-line text-body-s text-grey-light">
          가볍게 한마디 남기면{"\n"}다른 의견도 자연스럽게 볼 수 있어요
        </p>
      </div>
    );
  }

  return (
    <section className="px-5 py-4 space-y-5">
      {messages.map((message) => {
        const optionTextColor = message.optionColor === "orange" ? "text-secondary" : "text-primary";
        const avatarBg = message.optionColor === "orange" ? "bg-yellow-100" : "bg-blue-100";

        if (message.isMine) {
          return (
            <div key={message.id} className="flex justify-end">
              <div className="max-w-[75%]">
                <div className="flex justify-end gap-1 mb-1 text-label-s">
                  <span className="text-grey-dark">{message.nickname}</span>
                  <span className={optionTextColor}>{message.optionLabel}</span>
                </div>

                <div className="flex items-end gap-2">
                  <span className="text-label-s text-grey-light">{message.time}</span>
                  <p className="px-4 py-3 bg-white border rounded-2xl border-grey-stroke text-label-m text-grey-black">
                    {message.message}
                  </p>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div key={message.id} className="flex gap-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${avatarBg}`}>⚡</div>

            <div className="max-w-[75%]">
              <div className="flex gap-1 mb-1 text-label-s">
                <span className="text-grey-dark">{message.nickname}</span>
                <span className={optionTextColor}>{message.optionLabel}</span>
              </div>

              <div className="flex items-end gap-2">
                <p className="px-4 py-3 rounded-2xl bg-grey-chat text-label-m text-grey-black">{message.message}</p>
                <span className="text-label-s text-grey-light">{message.time}</span>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
