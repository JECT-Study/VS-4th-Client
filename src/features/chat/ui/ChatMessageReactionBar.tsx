import clsx from "clsx";
import { type ChatMessageReactionState, formatChatReactionCount } from "../model/chatMessageReaction";

interface ChatMessageReactionBarProps {
  reactionState: ChatMessageReactionState;
  align: "left" | "right";
  isDark?: boolean;
}

const REACTION_ITEMS = [
  { type: "THUMBS_UP", emoji: "👍" },
  { type: "THUMBS_DOWN", emoji: "👎" },
] as const;

export function ChatMessageReactionBar({ reactionState, align, isDark = false }: ChatMessageReactionBarProps) {
  const visibleReactions = REACTION_ITEMS.filter((item) => reactionState[item.type] > 0);

  if (visibleReactions.length === 0) return null;

  return (
    <div className={clsx("mt-2 flex gap-1", align === "right" ? "justify-end" : "justify-start")}>
      {visibleReactions.map((item) => {
        const isMine = reactionState.myReaction === item.type;

        return (
          <span
            key={item.type}
            className={clsx(
              "inline-flex h-7 min-w-12 select-none items-center justify-center gap-1 rounded-full px-2.5 text-label-m",
              isDark
                ? isMine
                  ? "bg-[#434346] text-white"
                  : "bg-[#2A2C2F] text-white"
                : isMine
                  ? "bg-primary-100 text-grey-black"
                  : "bg-grey-divider text-grey-black",
            )}
          >
            <span aria-hidden="true" className="text-[18px] leading-none opacity-90">
              {item.emoji}
            </span>
            <span>{formatChatReactionCount(reactionState[item.type])}</span>
          </span>
        );
      })}
    </div>
  );
}
