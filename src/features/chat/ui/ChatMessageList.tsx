import { PROFILE_COLOR } from "@features/signup/config/profileColors";
import clsx from "clsx";
import { formatTimeLabel } from "../lib/formatChatTime";
import type { ChatMessageResponse } from "../model/types";

interface ChatMessageListProps {
  messages: ChatMessageResponse[];
  optionA: string;
  optionB: string;
}

export function ChatMessageList({ messages, optionA, optionB }: ChatMessageListProps) {
  if (messages.length === 0) {
    return (
      // 빈 화면일 때도 공간을 다 채우도록 flex-1 추가
      <div className="flex flex-col items-center justify-center flex-1 min-h-[420px] px-5 text-center">
        <h2 className="text-title-m text-grey-black">첫 번째 메시지를 남겨보세요!</h2>
        <p className="mt-4 whitespace-pre-line text-body-s text-grey-light">
          가볍게 한마디 남기면{"\n"}다른 의견도 자연스럽게 볼 수 있어요
        </p>
      </div>
    );
  }

  return (
    // 👇 h-full 대신 flex-1을 사용하여 남는 공간을 꽉 채우도록 수정
    // 👇 justify-end 속성 제거 (스크롤 잘림 버그 방지)
    <section className="flex flex-col flex-1 px-5 py-4 space-y-5 min-h-[420px]">
      {/* 👇 상단에 남는 공간을 모두 밀어내는 빈 영역을 추가하여 자연스럽게 메시지들을 하단 정렬합니다. */}
      <div className="flex-1" />

      {messages.map((message) => {
        const isOptionA = message.senderVoteOption === "A";
        const optionLabel = isOptionA ? optionA : optionB;
        const optionTextColor = isOptionA ? "text-secondary" : "text-primary";

        if (message.isMine) {
          return (
            <div key={message.messageId} className="flex justify-end">
              <div className="max-w-[75%]">
                <div className="flex justify-end gap-1 mb-1 text-label-s">
                  <span className="text-grey-dark">{message.senderNickname}</span>
                  {message.senderVoteOption && (
                    <span className={clsx(optionTextColor, "max-w-[116px] truncate")}>{optionLabel}</span>
                  )}
                </div>

                <div className="flex items-end justify-end gap-2">
                  <span className="text-label-s text-grey-light">{formatTimeLabel(message.sentAt)}</span>
                  <p className="px-4 py-3 bg-white border rounded-2xl border-grey-stroke text-label-m text-grey-black">
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div key={message.messageId} className="flex gap-3">
            <div className="flex w-10 h-10 shrink-0">
              <img
                src={PROFILE_COLOR[message.senderProfileIcon as keyof typeof PROFILE_COLOR]}
                alt=""
                className="object-cover w-full h-full rounded-full"
              />
            </div>
            <div className="max-w-[75%]">
              <div className="flex gap-1 mb-1 text-label-s">
                <span className="text-grey-dark">{message.senderNickname}</span>
                {message.senderVoteOption && (
                  <span className={clsx(optionTextColor, "max-w-[116px] truncate")}>{optionLabel}</span>
                )}
              </div>

              <div className="flex items-end gap-2">
                <p className="px-4 py-3 rounded-2xl bg-grey-chat text-label-m text-grey-black">{message.content}</p>
                <span className="text-label-s text-grey-light">{formatTimeLabel(message.sentAt)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
