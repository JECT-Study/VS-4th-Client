import { useEffect, useState } from "react";
import type { VoteOption } from "../model/types";

interface ImmersiveVoteOptionCardProps {
  option: VoteOption;
  isVoted: boolean;
  isMajority: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export function ImmersiveVoteOptionCard({
  option,
  isVoted,
  isMajority,
  isSelected,
  onClick,
}: ImmersiveVoteOptionCardProps) {
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
        className="flex h-[100px] min-w-0 flex-1 basis-0 flex-col items-center justify-center rounded-lg border border-white/60 bg-white/30 px-3 text-center"
        onClick={onClick}
      >
        <span className="flex min-h-12 items-center justify-center whitespace-pre-wrap text-body-s text-grey-divider">
          {option.label}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`relative flex h-[100px] min-w-0 flex-1 basis-0 overflow-hidden rounded-lg border-2 text-center shadow-[0px_1px_6px_0px_rgba(0,_0,_0,_0.25)] ${
        isSelected
          ? `${isMajority ? "border-[#9A9AF6]" : "border-[#F69B30]"} bg-white/30 text-grey-divider`
          : "border-transparent bg-white/25 text-grey-divider"
      }`}
      onClick={onClick}
    >
      <span
        className={`absolute bottom-0 left-0 right-0 transition-[height] duration-[600ms] ease-out ${
          isMajority ? "bg-[rgba(119,80,187,0.4)]" : "bg-[#8F6D4B]"
        }`}
        style={{ height: `${animatedRatio}%` }}
        aria-hidden
      />
      <span className="relative z-10 flex h-full w-full flex-col items-center justify-center px-3 py-3">
        <span className="flex min-h-12 items-center justify-center whitespace-pre-wrap text-body-m">
          {option.label}
        </span>
        <span className="mt-0.5 text-label-s text-grey-divider">
          {isSelected && (
            <span className={`inline-block w-4 h-4 mr-1 ${isMajority ? "text-[#9A9AF6]" : "text-[#F69B30]"}`}>✓</span>
          )}
          {ratio}%
        </span>
      </span>
    </button>
  );
}
