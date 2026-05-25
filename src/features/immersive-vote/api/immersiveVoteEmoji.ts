import { defaultApi } from "@base/api/defaultApi";
import type { EmojiResponse } from "@features/votes/model/types";
import type { EmojiType } from "../model/types";

export const immersiveReactEmoji = (voteId: number, emoji: EmojiType | null): Promise<EmojiResponse> =>
  defaultApi.reactOnImmersiveVote(voteId, { emoji: emoji ?? undefined }).then((r) => r.data as EmojiResponse);
