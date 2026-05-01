import type { VoteSortType } from "../types/home";

interface VoteFilterBarProps {
  sortType: VoteSortType;
  excludeEnded: boolean;
  onChangeSortType: (sortType: VoteSortType) => void;
  onToggleExcludeEnded: () => void;
}

const sortLabels: Record<VoteSortType, string> = {
  latest: "최신순",
  popular: "인기순",
  participant: "참여순",
};

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

      <select
        value={sortType}
        onChange={(event) => onChangeSortType(event.target.value as VoteSortType)}
        className="px-4 py-2 bg-white border rounded-full shadow-sm outline-none border-grey-stroke text-label-s text-grey-dark"
      >
        {Object.entries(sortLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
