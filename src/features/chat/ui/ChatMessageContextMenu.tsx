import type { ChatMessageReactionType } from "../model/types";

interface ChatMessageContextMenuProps {
  anchorRect: DOMRect;
  onClose: () => void;
  onReact: (reaction: ChatMessageReactionType) => void;
  onReply: () => void;
}

const MENU_WIDTH = 312;
const MENU_HEIGHT = 64;
const MENU_GAP = 8;
const VIEWPORT_PADDING = 16;

export function ChatMessageContextMenu({ anchorRect, onClose, onReact, onReply }: ChatMessageContextMenuProps) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const width = Math.min(MENU_WIDTH, viewportWidth - VIEWPORT_PADDING * 2);
  const left = Math.min(
    Math.max(anchorRect.left + anchorRect.width / 2 - width / 2, VIEWPORT_PADDING),
    viewportWidth - VIEWPORT_PADDING - width,
  );
  const preferredTop = anchorRect.bottom + MENU_GAP;
  const top =
    preferredTop + MENU_HEIGHT <= viewportHeight - VIEWPORT_PADDING
      ? preferredTop
      : Math.max(VIEWPORT_PADDING, anchorRect.top - MENU_HEIGHT - MENU_GAP);

  const handleReact = (reaction: ChatMessageReactionType) => {
    onReact(reaction);
    onClose();
  };

  const handleReply = () => {
    onReply();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40" onContextMenu={(event) => event.preventDefault()} role="presentation">
      <button type="button" className="absolute inset-0 bg-black/20" onClick={onClose} aria-label="메뉴 닫기" />
      <div
        className="fixed flex h-16 items-center rounded-full bg-white px-4 shadow-[0_8px_24px_rgba(19,19,19,0.18)]"
        style={{ top, left, width }}
        role="menu"
      >
        <button
          type="button"
          className="flex h-12 flex-1 items-center justify-center text-[28px]"
          onClick={() => handleReact("THUMBS_UP")}
          aria-label="좋아요"
        >
          👍
        </button>
        <button
          type="button"
          className="flex h-12 flex-1 items-center justify-center text-[28px]"
          onClick={() => handleReact("THUMBS_DOWN")}
          aria-label="싫어요"
        >
          👎
        </button>
        <div className="mx-2 h-8 w-px bg-grey-stroke" />
        <button
          type="button"
          className="flex h-12 flex-[1.25] items-center justify-center whitespace-nowrap text-body-m text-grey-black"
          onClick={handleReply}
        >
          답장
        </button>
      </div>
    </div>
  );
}
