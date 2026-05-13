import type { EmojiType } from "../model/types";

const EMOJI_ASSET_DEF = {
  LIKE: { img: "/assets/images/emoji/smiling-face.png", label: "공감" },
  SAD: { img: "/assets/images/emoji/crying-face.png", label: "슬픔" },
  ANGRY: { img: "/assets/images/emoji/enraged-face.png", label: "분노" },
  WOW: { img: "/assets/images/emoji/smiling-face-with-heart-eyes.png", label: "호감" },
} satisfies Record<EmojiType, { img: string; label: string }>;

export const EMOJI_ASSETS = (Object.keys(EMOJI_ASSET_DEF) as EmojiType[]).map((type) => ({
  type,
  ...EMOJI_ASSET_DEF[type],
}));

export const EMOJI_IMGS = Object.fromEntries(
  (Object.keys(EMOJI_ASSET_DEF) as EmojiType[]).map((type) => [type, EMOJI_ASSET_DEF[type].img]),
) as Record<EmojiType, string>;
