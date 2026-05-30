import { Dropdown } from "@base/ui/Dropdown";
import { showToast } from "@base/ui/Toast";
import { useState } from "react";
import type { EmojiType } from "../model/types";
import type { EmojiItem, VoteUserType } from "../model/useVoteDetail";
import ChatAuthRequiredModal from "./ChatAuthRequiredModal";
import { ChatBottomSheet } from "@features/chat/ui/ChatBottomSheet";

interface VoteReactionBarProps {
  voteId: string;
  emojiList: EmojiItem[];
  commentCount: number | undefined;
  onEmojiClick: (type: EmojiType) => void;
  isEmojiPending: boolean;
  voteUserType: VoteUserType;
}

export function VoteReactionBar({
  voteId,
  emojiList,
  commentCount,
  onEmojiClick,
  isEmojiPending,
  voteUserType,
}: VoteReactionBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => {
    if (voteUserType === "guest") {
      setIsOpen(true);
      return;
    }

    if (voteUserType === "member-not-voted") {
      showToast.warning("투표해야 채팅에 참여할 수 있어요");
      return;
    }

    setIsChatOpen(true);
  };

  const totalEmojiCount = emojiList.reduce((sum, item) => sum + (item.count ?? 0), 0);

  return (
    <div className="mt-5 flex items-center gap-4">
      <Dropdown
        trigger={
          <button type="button" className="flex items-center gap-2">
            <img src="/assets/icons/smile.svg" alt="이모지 선택" />
            <span className="text-label-m text-grey-dark">{totalEmojiCount}</span>
          </button>
        }
        className="px-5 pt-2 pb-1 bg-grey-stroke rounded-[20px]"
      >
        <div className="flex gap-6 items-center">
          {emojiList.map(({ type, count, isMine, img }) => (
            <button
              key={type}
              type="button"
              className="flex flex-col items-center gap-1"
              onClick={() => onEmojiClick(type)}
              disabled={isEmojiPending}
            >
              <img src={img} alt="" className="w-6 h-6" />
              <span className={isMine ? "text-label-l text-primary" : "text-label-s text-grey-light"}>{count}</span>
            </button>
          ))}
        </div>
      </Dropdown>

      <button type="button" className="flex items-center gap-2" onClick={openChat}>
        <img src="/assets/icons/chat.svg" alt="채팅 보기" />
        <span className="text-label-m text-grey-dark">{commentCount}</span>
      </button>

      <ChatAuthRequiredModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <ChatBottomSheet isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} voteId={Number(voteId)} />
    </div>
  );
}
