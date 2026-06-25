import type { ChatRoomHeaderResponse, SenderVoteOption } from "./types";

export type ChatVoteOption = Exclude<SenderVoteOption, null>;

export interface ChatSelectedOption {
  voteOption: ChatVoteOption;
  label: string;
}

export function resolveChatSelectedOption(header: ChatRoomHeaderResponse | undefined): ChatSelectedOption | null {
  if (!header) return null;

  const voteOption = header?.myVoteOption ?? null;
  if (!voteOption) return null;

  return {
    voteOption,
    label: voteOption === "A" ? header.optionA : header.optionB,
  };
}

export function resolveChatVoteOptionFromOptionId(
  optionIds: number[],
  selectedOptionId: number | null,
): ChatVoteOption | null {
  if (selectedOptionId == null) return null;

  const selectedIndex = optionIds.findIndex((optionId) => optionId === selectedOptionId);
  if (selectedIndex === 0) return "A";
  if (selectedIndex === 1) return "B";
  return null;
}
