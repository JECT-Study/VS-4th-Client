import { useState } from "react";
import type { VoteSortType } from "./home.ts";

export function useVoteFilter() {
  const [sortType, setSortType] = useState<VoteSortType>("LATEST");
  const [excludeEnded, setExcludeEnded] = useState(true);

  return {
    sortType,
    setSortType,
    excludeEnded,
    toggleExcludeEnded: () => setExcludeEnded((v) => !v),
  };
}
