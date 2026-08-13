import type { ImmersiveFeedItem, VoteOption } from "../model/types";
import { ImmersiveVoteOptionCard } from "./ImmersiveVoteOptionCard";

interface ImmersiveVoteOptionsProps {
  vote: ImmersiveFeedItem;
  onOptionClick: (optionId: number) => void;
}

export function getMajorityOptionId(options: VoteOption[]): number | undefined {
  return options.reduce<VoteOption | undefined>((majority, option) => {
    if (!majority) return option;
    return (option.ratio ?? 0) > (majority.ratio ?? 0) ? option : majority;
  }, undefined)?.optionId;
}

export function ImmersiveVoteOptions({ vote, onOptionClick }: ImmersiveVoteOptionsProps) {
  const majorityOptionId = getMajorityOptionId(vote.options);

  return (
    <div className="flex w-full gap-2 px-5">
      {vote.options.map((option) => (
        <ImmersiveVoteOptionCard
          key={option.optionId}
          option={option}
          isVoted={vote.myVote.voted}
          isMajority={option.optionId === majorityOptionId}
          isSelected={vote.myVote.selectedOptionId === option.optionId}
          onClick={() => onOptionClick(option.optionId)}
        />
      ))}
    </div>
  );
}
