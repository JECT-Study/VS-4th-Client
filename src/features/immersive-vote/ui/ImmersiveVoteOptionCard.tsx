import { useEffect, useState } from "react";
import type { VoteOption } from "../model/types";

interface ImmersiveVoteOptionCardProps {
  option: VoteOption;
  isVoted: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export function ImmersiveVoteOptionCard({ option, isVoted, isSelected, onClick }: ImmersiveVoteOptionCardProps) {
  const ratio = option.ratio ?? 0;
  const [animatedRatio, setAnimatedRatio] = useState(0);

  useEffect(() => {
    if (!isVoted) {
      setAnimatedRatio(0);
      return;
    }

    const frame = window.requestAnimationFrame(() => setAnimatedRatio(ratio));
    return () => window.cancelAnimationFrame(frame);
  }, [isVoted, ratio]);

  if (!isVoted) {
    return (
      <button
        type="button"
        className="flex min-h-[130px] flex-1 flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#E5E1F0] to-[#DBD3F2] p-4 pb-6 text-center shadow-[0px_1px_6px_0px_rgba(0,_0,_0,_0.25)]"
        onClick={onClick}
      >
        <span className="min-h-[60px] text-body-m text-grey-black flex justify-center items-center whitespace-pre-wrap">
          {option.label}
        </span>
        <span className="mt-1 rounded-[20px] bg-primary px-[10px] py-[6px] text-label-s text-grey-divider">선택</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`relative flex min-h-[130px] flex-1 overflow-hidden rounded-lg text-center shadow-[0px_1px_6px_0px_rgba(0,_0,_0,_0.25)] bg-gradient-to-b from-[#E5E1F0] to-[#DBD3F2] ${
        isSelected ? "text-grey-divider" : "text-grey-dark"
      }`}
      onClick={onClick}
    >
      {!isSelected && (
        <span
          className="absolute bottom-0 left-0 right-0 bg-[#BEBEDD] transition-[height] duration-[600ms] ease-out"
          style={{ height: `${animatedRatio}%` }}
          aria-hidden
        />
      )}
      {isSelected && (
        <span
          className="absolute bottom-0 left-0 right-0 bg-primary transition-[height] duration-[600ms] ease-out"
          style={{ height: `${animatedRatio}%` }}
          aria-hidden
        />
      )}
      <span className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 py-5">
        <span className="min-h-[60px] text-body-m flex items-center justify-center whitespace-pre-wrap">
          {option.label}
        </span>
        <span className={`mt-1 text-body-m ${isSelected ? "text-grey-divider" : "text-grey-dark"}`}>{ratio}%</span>
      </span>
    </button>
  );
}
