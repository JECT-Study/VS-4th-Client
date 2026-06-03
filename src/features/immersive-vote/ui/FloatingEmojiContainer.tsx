import { FLOATING_EMOJI_DURATION_MS, FLOATING_EMOJI_TRAVEL_PX } from "../config/constants";
import { EMOJI_IMGS } from "../config/emojiAssets";
import type { FloatingEmoji } from "../model/types";

interface FloatingEmojiContainerProps {
  floatingEmojis: FloatingEmoji[];
  onAnimationEnd: (id: string) => void;
}

export function FloatingEmojiContainer({ floatingEmojis, onAnimationEnd }: FloatingEmojiContainerProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {floatingEmojis.map((item) => (
        <img
          key={item.id}
          src={EMOJI_IMGS[item.emoji]}
          alt=""
          className="absolute animate-float-emoji w-6 h-6"
          style={
            {
              left: item.x,
              top: item.y,
              "--float-travel-px": `${FLOATING_EMOJI_TRAVEL_PX}px`,
              "--float-duration-ms": `${FLOATING_EMOJI_DURATION_MS}ms`,
            } as React.CSSProperties
          }
          onAnimationEnd={() => onAnimationEnd(item.id)}
        />
      ))}
    </div>
  );
}
