import { useState } from "react";
import type { VoteSortType } from "./home.ts";

const HOME_VOTE_FILTER_STORAGE_KEY = "homeVoteFilter";
const DEFAULT_SORT_TYPE: VoteSortType = "LATEST";
const DEFAULT_EXCLUDE_ENDED = true;

interface HomeVoteFilterState {
  sortType: VoteSortType;
  excludeEnded: boolean;
}

const isVoteSortType = (value: unknown): value is VoteSortType =>
  value === "LATEST" || value === "POPULAR" || value === "ENDING_SOON";

const readSavedFilter = (): HomeVoteFilterState => {
  if (typeof window === "undefined") {
    return { sortType: DEFAULT_SORT_TYPE, excludeEnded: DEFAULT_EXCLUDE_ENDED };
  }

  try {
    const savedFilter = window.sessionStorage.getItem(HOME_VOTE_FILTER_STORAGE_KEY);
    if (!savedFilter) return { sortType: DEFAULT_SORT_TYPE, excludeEnded: DEFAULT_EXCLUDE_ENDED };

    const parsed = JSON.parse(savedFilter) as Partial<HomeVoteFilterState>;
    return {
      sortType: isVoteSortType(parsed.sortType) ? parsed.sortType : DEFAULT_SORT_TYPE,
      excludeEnded: typeof parsed.excludeEnded === "boolean" ? parsed.excludeEnded : DEFAULT_EXCLUDE_ENDED,
    };
  } catch {
    return { sortType: DEFAULT_SORT_TYPE, excludeEnded: DEFAULT_EXCLUDE_ENDED };
  }
};

const saveFilter = (filter: HomeVoteFilterState) => {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(HOME_VOTE_FILTER_STORAGE_KEY, JSON.stringify(filter));
  } catch {
    // Ignore storage failures so the filter still works as in-memory React state.
  }
};

export function useVoteFilter() {
  const [filter, setFilter] = useState<HomeVoteFilterState>(readSavedFilter);

  const setSortType = (sortType: VoteSortType) => {
    setFilter((prev) => {
      const next = { ...prev, sortType };
      saveFilter(next);
      return next;
    });
  };

  const changeExcludeEnded = (excludeEnded: boolean) => {
    setFilter(() => {
      const next = {
        sortType: DEFAULT_SORT_TYPE,
        excludeEnded,
      };
      saveFilter(next);
      return next;
    });
  };

  return {
    sortType: filter.sortType,
    setSortType,
    excludeEnded: filter.excludeEnded,
    changeExcludeEnded,
  };
}
