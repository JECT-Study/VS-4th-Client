import type { ImmersiveFeedItem } from "../model/types";
import { ImmersiveVoteOptionCard } from "./ImmersiveVoteOptionCard";

interface ImmersiveVoteOptionsProps {
  vote: ImmersiveFeedItem;
  onOptionClick: (optionId: number) => void;
}

export function ImmersiveVoteOptions({ vote, onOptionClick }: ImmersiveVoteOptionsProps) {
  return (
    <div className="flex gap-3 px-5">
      {vote.options.map((option) => (
        <ImmersiveVoteOptionCard
          key={option.optionId}
          option={option}
          isVoted={vote.myVote.voted}
          isSelected={vote.myVote.selectedOptionId === option.optionId}
          onClick={() => onOptionClick(option.optionId)}
        />
      ))}
    </div>
  );
}
