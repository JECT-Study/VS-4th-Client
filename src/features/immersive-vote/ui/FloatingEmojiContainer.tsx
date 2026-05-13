import type { EmojiType, FloatingEmoji } from "../model/types";

const emojiImgs: Record<EmojiType, string> = {
  LIKE: "/assets/images/emoji/smiling-face.png",
  SAD: "/assets/images/emoji/crying-face.png",
  ANGRY: "/assets/images/emoji/enraged-face.png",
  WOW: "/assets/images/emoji/smiling-face-with-heart-eyes.png",
};

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
          src={emojiImgs[item.emoji]}
          alt=""
          className="absolute animate-float-emoji w-6 h-6"
          style={{ left: item.x, top: item.y }}
          onAnimationEnd={() => onAnimationEnd(item.id)}
        />
      ))}
    </div>
  );
}
