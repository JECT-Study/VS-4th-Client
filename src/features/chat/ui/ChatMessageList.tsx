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
            <div className="flex min-h-[420px] flex-col items-center justify-center px-5 text-center">
                <h2 className="text-title-m text-grey-black">첫 번째 메시지를 남겨보세요!</h2>
                <p className="mt-4 whitespace-pre-line text-body-s text-grey-light">
                    가볍게 한마디 남기면{"\n"}다른 의견도 자연스럽게 볼 수 있어요
                </p>
            </div>
        );
    }

    return (
        // 수정된 부분: flex, flex-col, justify-end, min-h-[420px] (또는 flex-1) 추가
        <section className="flex flex-col justify-end min-h-[420px] h-full px-5 py-4 space-y-5">
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

                                <div className="flex items-end gap-2 justify-end">
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
                        <div className="flex h-10 w-10 shrink-0">
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