import { Dropdown } from "@base/ui/Dropdown";
import { useRef } from "react";
import type { EmojiReactionItem, EmojiType, FloatingEmojiOrigin } from "../model/types";

interface EmojiReactionButtonProps {
  emojiList: EmojiReactionItem[];
  totalCount: number;
  getEmojiOrigin: (triggerElement: HTMLElement) => FloatingEmojiOrigin | null;
  onEmojiClick: (type: EmojiType, origin: FloatingEmojiOrigin | null) => void;
}

export function EmojiReactionButton({ emojiList, totalCount, getEmojiOrigin, onEmojiClick }: EmojiReactionButtonProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleEmojiClick = (type: EmojiType) => {
    onEmojiClick(type, triggerRef.current ? getEmojiOrigin(triggerRef.current) : null);
  };

  return (
    <Dropdown
      trigger={
        <button
          ref={triggerRef}
          type="button"
          className="flex flex-col items-center gap-1 text-white w-12 h-12"
          aria-label="이모지 반응"
        >
          <img src="/assets/icons/smile-big.svg" alt="" className="h-7 w-7 drop-shadow-[0_0_5px_rgba(0,0,0,0.4)]" />
          <span className="text-label-s text-[#F7F6F9] drop-shadow-[0_0_5px_rgba(0,0,0,0.4)] flex w-7 items-center justify-center">
            {totalCount}
          </span>
        </button>
      }
      placement="left"
      className="px-[10px] py-[18px] bg-[#E5E1F0] rounded-[40px]"
    >
      <div className="flex gap-3 items-center flex-col">
        {emojiList.map(({ type, count, isMine, img }) => (
          <button
            key={type}
            type="button"
            className="flex flex-col items-center gap-1 w-10 h-[42px] justify-center"
            onClick={() => handleEmojiClick(type)}
          >
            <img src={img} alt="" className="w-6 h-6" />
            <span className={isMine ? "text-label-l text-primary" : "text-label-s text-grey-light"}>{count}</span>
          </button>
        ))}
      </div>
    </Dropdown>
  );
}
