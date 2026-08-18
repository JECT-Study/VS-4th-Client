import { SortDropdown } from "@base/ui/SortDropdown";
import type { SortOption } from "@base/ui/SortDropdown";
import clsx from "clsx";
import type { VoteSortType } from "../model/home.ts";

interface VoteFilterBarProps {
  sortType: VoteSortType;
  excludeEnded: boolean;
  onChangeSortType: (sortType: VoteSortType) => void;
  onChangeExcludeEnded: (excludeEnded: boolean) => void;
}

const SORT_OPTIONS: SortOption<VoteSortType>[] = [
  { label: "최신순", value: "LATEST" },
  { label: "종료임박순", value: "ENDING_SOON" },
  { label: "인기순", value: "POPULAR" },
];

export function VoteFilterBar({ sortType, excludeEnded, onChangeSortType, onChangeExcludeEnded }: VoteFilterBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChangeExcludeEnded(false)}
          className={clsx("flex items-center gap-1 text-body-s", excludeEnded ? "text-grey-light" : "text-grey-black")}
        >
          {!excludeEnded && <img src="/assets/icons/check-s.svg" alt="" />}
          <span>전체</span>
        </button>

        <hr className="w-px h-5 bg-grey-stroke" />

        <button
          type="button"
          onClick={() => onChangeExcludeEnded(true)}
          className={clsx("flex items-center gap-1 text-body-s", excludeEnded ? "text-grey-black" : "text-grey-light")}
        >
          {excludeEnded && <img src="/assets/icons/check-s.svg" alt="" />}
          <span>진행 중</span>
        </button>
      </div>

      <SortDropdown options={SORT_OPTIONS} value={sortType} onChange={onChangeSortType} />
    </div>
  );
}
