import { SortDropdown } from "@base/ui/SortDropdown";
import type { SortOption } from "@base/ui/SortDropdown";
import type { VoteSortType } from "../model/home.ts";
import clsx from "clsx";

interface VoteFilterBarProps {
  sortType: VoteSortType;
  excludeEnded: boolean;
  onChangeSortType: (sortType: VoteSortType) => void;
  onToggleExcludeEnded: () => void;
}

const SORT_OPTIONS: SortOption<VoteSortType>[] = [
  { label: "최신순", value: "LATEST" },
  { label: "종료임박순", value: "ENDING_SOON" },
  { label: "인기순", value: "POPULAR" },
];

export function VoteFilterBar({ sortType, excludeEnded, onChangeSortType, onToggleExcludeEnded }: VoteFilterBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <button
        type="button"
        onClick={onToggleExcludeEnded}
        className={clsx("flex items-center gap-1 text-label-m", excludeEnded ? "text-grey-black" : "text-grey-light")}
      >
        <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            d="M0.75 3.65L5.35 8.15L12.75 0.75"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>종료된 투표 제외</span>
      </button>

      <SortDropdown
        options={SORT_OPTIONS.filter(({ value }) => !excludeEnded || value !== "ENDING_SOON")}
        value={sortType}
        onChange={onChangeSortType}
      />
    </div>
  );
}
