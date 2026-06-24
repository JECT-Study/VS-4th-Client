import { PROFILE_COLOR } from "@features/signup/config/profileColors";
import { useUserProfileSheet } from "@features/user-profile/model/useUserProfileSheet";
import { UserProfileBottomSheet } from "@features/user-profile/ui/UserProfileBottomSheet";
import clsx from "clsx";
import { formatTimeLabel } from "../lib/formatChatTime";
import type { ChatMessageResponse } from "../model/types";

interface ChatMessageListProps {
  messages: ChatMessageResponse[];
  optionA: string;
  optionB: string;
}

export function ChatMessageList({ messages, optionA, optionB }: ChatMessageListProps) {
  // 일반형 투표 풀페이지 채팅 → 라이트 모드 / 일반형 랜딩
  const profileSheet = useUserProfileSheet({ originSurface: "general" });

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-5 text-center">
        <h2 className="text-title-m text-grey-black">첫 번째 메시지를 남겨보세요!</h2>
        <p className="mt-4 whitespace-pre-line text-body-s text-grey-light">
          가볍게 한마디 남기면{"\n"}다른 의견도 자연스럽게 볼 수 있어요
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="flex flex-col justify-end flex-1 px-5 pt-4 pb-1 space-y-5">
        {messages.map((message) => {
          const isOptionA = message.senderVoteOption === "A";
          const optionLabel = isOptionA ? optionA : optionB;
          const optionTextColor = isOptionA ? "text-secondary" : "text-primary";

          // "알 수 없음" 처리 및 표시 이름 설정
          const isUnknownUser = message.senderNickname === "알 수 없음" || !message.senderProfileIcon;
          const displayName = message.senderNickname === "알 수 없음" ? "(알 수 없음)" : message.senderNickname;
          const canOpenProfile = !isUnknownUser;
          const handleProfileClick = () => profileSheet.openProfile(message.senderId);

          if (message.isMine) {
            return (
              <div key={message.messageId} className="flex justify-end">
                <div className="max-w-[75%]">
                  <div className="flex justify-end gap-1 mb-1 text-label-s">
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
              <button
                type="button"
                className="flex w-10 h-10 shrink-0"
                onClick={handleProfileClick}
                disabled={!canOpenProfile}
                aria-label={`${displayName} 프로필 보기`}
              >
                <img
                  src={
                    isUnknownUser
                      ? "/assets/icons/default-profile.svg"
                      : PROFILE_COLOR[message.senderProfileIcon as keyof typeof PROFILE_COLOR]
                  }
                  alt=""
                  className="object-cover w-full h-full bg-gray-200 rounded-full"
                />
              </button>
              <div className="max-w-[75%]">
                <div className="flex gap-1 mb-1 text-label-s">
                  <button
                    type="button"
                    className="text-grey-dark"
                    onClick={handleProfileClick}
                    disabled={!canOpenProfile}
                  >
                    {displayName}
                  </button>
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

      <UserProfileBottomSheet
        isOpen={profileSheet.isOpen}
        onClose={profileSheet.close}
        profile={profileSheet.profile}
        isDark={false}
        onVoteClick={profileSheet.handleVoteClick}
      />
    </>
  );
}
