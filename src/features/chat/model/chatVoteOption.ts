import type { VoteDetail } from "@features/votes/model/types";
import type { SenderVoteOption } from "./types";

export type ChatVoteOption = Exclude<SenderVoteOption, null>;

export interface ChatSelectedOption {
  voteOption: ChatVoteOption;
  label: string;
}

export function resolveMyChatVoteOption(voteDetail: VoteDetail | undefined): ChatVoteOption | null {
  const selectedOptionId = voteDetail?.myVote.voted ? voteDetail.myVote.selectedOptionId : null;
  if (selectedOptionId == null) return null;

  const selectedIndex = voteDetail?.options.findIndex((option) => option.optionId === selectedOptionId) ?? -1;
  if (selectedIndex === 0) return "A";
  if (selectedIndex === 1) return "B";
  return null;
}

export function resolveMyChatSelectedOption(
  voteDetail: VoteDetail | undefined,
  optionA: string,
  optionB: string,
): ChatSelectedOption | null {
  const voteOption = resolveMyChatVoteOption(voteDetail);
  if (!voteOption) return null;

  const fallbackLabel = voteOption === "A" ? optionA : optionB;
  const selectedOptionId = voteDetail?.myVote.selectedOptionId;
  const selectedOptionLabel = voteDetail?.options.find((option) => option.optionId === selectedOptionId)?.label;

  return {
    voteOption,
    label: selectedOptionLabel || fallbackLabel,
  };
}
