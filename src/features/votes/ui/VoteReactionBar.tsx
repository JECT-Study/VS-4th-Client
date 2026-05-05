import { Dropdown } from "@base/ui/Dropdown";
import type { EmojiType } from "../model/types";
import type { EmojiItem } from "../model/useVoteDetail";

interface VoteReactionBarProps {
  emojiList: EmojiItem[];
  commentCount: number | undefined;
  onEmojiClick: (type: EmojiType) => void;
  isEmojiPending: boolean;
}

export function VoteReactionBar({ emojiList, commentCount, onEmojiClick, isEmojiPending }: VoteReactionBarProps) {
  return (
    <div className="mt-5 flex items-center gap-4">
      <Dropdown
        trigger={
          <button type="button" className="flex items-center gap-2">
            <img src="/assets/icons/smile.svg" alt="이모지 선택" />
            <span className="text-label-m text-grey-dark">56</span>
          </button>
        }
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

      <button type="button" className="flex items-center gap-2">
        <img src="/assets/icons/chat.svg" alt="채팅 보기" />
        <span className="text-label-m text-grey-dark">{commentCount}</span>
      </button>
    </div>
  );
}
