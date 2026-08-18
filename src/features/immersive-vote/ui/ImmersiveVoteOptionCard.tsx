import { useEffect, useState } from "react";
import type { VoteOption } from "../model/types";

export type OptionAccent = "orange" | "purple";

const ACCENT_CLASSES: Record<OptionAccent, { border: string; fill: string; check: string }> = {
  orange: { border: "border-[#F69B30]", fill: "bg-[#8F6D4B]", check: "text-[#F69B30]" },
  purple: { border: "border-[#9A9AF6]", fill: "bg-[rgba(119,80,187,0.4)]", check: "text-[#9A9AF6]" },
};

interface ImmersiveVoteOptionCardProps {
  option: VoteOption;
  isVoted: boolean;
  accent: OptionAccent;
  isSelected: boolean;
  onClick: () => void;
}

export function ImmersiveVoteOptionCard({
  option,
  isVoted,
  accent,
  isSelected,
  onClick,
}: ImmersiveVoteOptionCardProps) {
  const ratio = option.ratio ?? 0;
  const [animatedRatio, setAnimatedRatio] = useState(0);
  const accentClasses = ACCENT_CLASSES[accent];

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
          ? `${accentClasses.border} bg-white/30 text-grey-divider`
          : "border-transparent bg-white/25 text-grey-divider"
      }`}
      onClick={onClick}
    >
      <span
        className={`absolute bottom-0 left-0 right-0 transition-[height] duration-[600ms] ease-out ${accentClasses.fill}`}
        style={{ height: `${animatedRatio}%` }}
        aria-hidden
      />
      <span className="relative z-10 flex h-full w-full flex-col items-center justify-center px-3 py-3">
        <span className="flex min-h-12 items-center justify-center whitespace-pre-wrap text-body-m">
          {option.label}
        </span>
        <span className="mt-0.5 text-label-s text-grey-divider">
          {isSelected && <CheckIcon className={`inline-block w-4 h-4 mr-1 align-middle ${accentClasses.check}`} />}
          {ratio}%
        </span>
      </span>
    </button>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4.30078 7.7998L7.30078 10.7998L12.3008 5.2998"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
