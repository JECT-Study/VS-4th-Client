import { apiClient } from "@base/api/client";
import type { EmojiResponse } from "@features/votes/model/types";
import type { EmojiType } from "../model/types";

export const immersiveReactEmoji = async (voteId: number, emoji: EmojiType | null): Promise<EmojiResponse> =>
  apiClient.put<EmojiResponse>(`/api/immersive-votes/${voteId}/emoji`, { emoji }).then((r) => r.data);
