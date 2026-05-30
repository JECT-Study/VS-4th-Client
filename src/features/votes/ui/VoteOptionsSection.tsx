import { useLayoutEffect, useRef } from "react";
import type { VoteOption } from "../model/types";
import { VoteBar } from "./VoteBar";
import { VoteTimeRemaining } from "./VoteTimeRemaining";

interface VoteOptionsSectionProps {
  options: VoteOption[] | undefined;
  myVote: { voted: boolean; selectedOptionId: number | null } | undefined;
  participantCount: number | undefined;
  endAt: string | undefined;
  isEnded: boolean;
  onOptionClick: (optionId: number) => void;
  onCancel: () => void;
  isCancelPending: boolean;
  isParticipatePending: boolean;
}

export function VoteOptionsSection({
  options,
  myVote,
  participantCount,
  endAt,
  isEnded,
  onOptionClick,
  onCancel,
  isCancelPending,
  isParticipatePending,
}: VoteOptionsSectionProps) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: options change triggers button re-renders which need re-measurement
  useLayoutEffect(() => {
    const btns = buttonRefs.current.filter((b): b is HTMLButtonElement => b !== null);
    if (btns.length === 0) return;
    for (const btn of btns) btn.style.minHeight = "";
    const maxH = Math.max(...btns.map((btn) => btn.offsetHeight));
    for (const btn of btns) btn.style.minHeight = `${maxH}px`;
  }, [options]);

  return (
    <div className="px-4 py-5 rounded-[20px] border border-grey-stroke mt-5">
      <div className="flex items-center gap-2">
        <img src="/assets/icons/vote-s.svg" alt="" />
        <span className="text-title-s leading-none">투표</span>
      </div>

      <div className="mt-2 flex flex-col gap-2 items-end">
        <button
          type="button"
          className={`text-label-s text-grey-light ${myVote?.voted && !isEnded ? "" : "invisible"}`}
          onClick={onCancel}
          disabled={isCancelPending || !myVote?.voted || isEnded}
        >
          다시 투표하기
        </button>

        {options?.map((option, index) => {
          const isSelected = myVote?.selectedOptionId === option.optionId;
          const hasVoted = myVote?.voted ?? false;
          return (
            <button
              key={option.optionId}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              type="button"
              className={`text-body-s px-4 py-3 rounded-lg bg-grey-stroke w-full text-left relative overflow-hidden flex items-center ${hasVoted && isSelected ? "text-grey-divider" : "text-grey-black"}`}
              onClick={() => onOptionClick(option.optionId)}
              disabled={isParticipatePending}
            >
              {hasVoted && option.ratio !== null && <VoteBar ratio={option.ratio} isSelected={isSelected} />}
              <span className="relative z-10 line-clamp-2">{option.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <img src="/assets/icons/pple.svg" alt="" />
          <span className="text-label-s text-grey-light">{participantCount}명 참여</span>
        </span>

        <span className="flex items-center gap-[6px] text-error">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <title>남은 시간</title>
            <circle cx="8" cy="8" r="5.4" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 5V8L10.2 10.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          {endAt && <VoteTimeRemaining endAt={endAt} />}
        </span>
      </div>
    </div>
  );
}
