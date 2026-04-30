import { useMemo, useState } from "react";
import type { VoteItem, VoteSortType } from "../types/home";

export function useVoteFilter(votes: VoteItem[]) {
  const [sortType, setSortType] = useState<VoteSortType>("latest");
  const [excludeEnded, setExcludeEnded] = useState(true);

  const filteredVotes = useMemo(() => {
    const visibleVotes = excludeEnded ? votes.filter((vote) => vote.status !== "ended") : votes;

    return [...visibleVotes].sort((a, b) => {
      if (sortType === "popular") {
        return (b.viewCount ?? 0) - (a.viewCount ?? 0);
      }

      if (sortType === "participant") {
        return b.participantCount - a.participantCount;
      }

      return b.id - a.id;
    });
  }, [excludeEnded, sortType, votes]);

  return {
    sortType,
    setSortType,
    excludeEnded,
    setExcludeEnded,
    filteredVotes,
  };
}
