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
            <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-220px)] px-5 text-center">
                <h2 className="text-title-m text-grey-black">첫 번째 메시지를 남겨보세요!</h2>
                <p className="mt-4 whitespace-pre-line text-body-s text-grey-light">
                    가볍게 한마디 남기면{"\n"}다른 의견도 자연스럽게 볼 수 있어요
                </p>
            </div>
        );
    }

    return (
        <section className="flex flex-col justify-end px-5 pt-4 pb-1 space-y-5 min-h-[calc(100dvh-220px)]">
            {messages.map((message) => {
                const isOptionA = message.senderVoteOption === "A";
                const optionLabel = isOptionA ? optionA : optionB;
                const optionTextColor = isOptionA ? "text-secondary" : "text-primary";

                // 👇 "알 수 없음" 처리 및 표시 이름 설정
                const isUnknownUser = message.senderNickname === "알 수 없음" || !message.senderProfileIcon;
                const displayName = message.senderNickname === "알 수 없음" ? "(알 수 없음)" : message.senderNickname;

                if (message.isMine) {
                    return (
                        <div key={message.messageId} className="flex justify-end">
                            <div className="max-w-[75%]">
                                <div className="flex justify-end gap-1 mb-1 text-label-s">
                                    {/* 👇 본인 메시지라도 닉네임 표시에 동일한 규칙 적용 */}
                                    <span className="text-grey-dark">{displayName}</span>
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
                                // 👇 프로젝트 규칙에 맞춰 src에 문자열 경로를 직접 할당
                                src={
                                    isUnknownUser
                                        ? "/assets/icons/default-profile.svg"
                                        : PROFILE_COLOR[message.senderProfileIcon as keyof typeof PROFILE_COLOR]
                                }
                                alt=""
                                className="object-cover w-full h-full bg-gray-200 rounded-full"
                            />
                        </div>
                        <div className="max-w-[75%]">
                            <div className="flex gap-1 mb-1 text-label-s">
                                {/* 👇 "(알 수 없음)" 괄호가 씌워진 displayName 적용 */}
                                <span className="text-grey-dark">{displayName}</span>
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