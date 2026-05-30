import { SortDropdown } from "@base/ui/SortDropdown";
import type { SortOption } from "@base/ui/SortDropdown";
import type { VoteSortType } from "../model/home.ts";

interface VoteFilterBarProps {
  sortType: VoteSortType;
  excludeEnded: boolean;
  onChangeSortType: (sortType: VoteSortType) => void;
  onToggleExcludeEnded: () => void;
}

const SORT_OPTIONS: SortOption<VoteSortType>[] = [
  { label: "최신순", value: "LATEST" },
  { label: "인기순", value: "POPULAR" },
  { label: "종료임박순", value: "ENDING_SOON" },
];

export function VoteFilterBar({ sortType, excludeEnded, onChangeSortType, onToggleExcludeEnded }: VoteFilterBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <button
        type="button"
        onClick={onToggleExcludeEnded}
        className="flex items-center gap-1 text-label-s text-grey-purple"
      >
        <span className="w-3 text-primary">{excludeEnded ? "✓" : ""}</span>
        <span>종료된 투표 제외</span>
      </button>

      <SortDropdown options={SORT_OPTIONS} value={sortType} onChange={onChangeSortType} />
    </div>
  );
}
