import type { ImmersiveFeedItem } from "../model/types";
import { ImmersiveVoteOptionCard, type OptionAccent } from "./ImmersiveVoteOptionCard";

interface ImmersiveVoteOptionsProps {
  vote: ImmersiveFeedItem;
  onOptionClick: (optionId: number) => void;
}

/** 선택 여부와 무관하게 위치로 색을 고정한다. 왼쪽(첫 번째) 선택지는 주황색, 나머지는 보라색. */
export function getOptionAccent(index: number): OptionAccent {
  return index === 0 ? "orange" : "purple";
}

export function ImmersiveVoteOptions({ vote, onOptionClick }: ImmersiveVoteOptionsProps) {
  return (
    <div className="flex w-full gap-2 px-5">
      {vote.options.map((option, index) => (
        <ImmersiveVoteOptionCard
          key={option.optionId}
          option={option}
          isVoted={vote.myVote.voted}
          accent={getOptionAccent(index)}
          isSelected={vote.myVote.selectedOptionId === option.optionId}
          onClick={() => onOptionClick(option.optionId)}
        />
      ))}
    </div>
  );
}
