import { defaultApi } from "@base/api/defaultApi";
import type { EmojiResponse, EmojiType } from "../model/types";

export const reactEmoji = (voteId: string, emoji: EmojiType | null): Promise<EmojiResponse> =>
  defaultApi.reactOnVote(Number(voteId), { emoji: emoji ?? undefined }).then((r) => r.data as EmojiResponse);
