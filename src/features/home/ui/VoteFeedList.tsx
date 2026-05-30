import { useEffect, useRef } from "react";
import type { VoteItem } from "../model/home.ts";
import { VoteCard } from "./VoteCard.tsx";

interface VoteFeedListProps {
  votes: VoteItem[];
  hasNextPage?: boolean;
  onClickVote?: (voteId: number) => void;
  onLoadMore?: () => void;
}

export function VoteFeedList({ votes, hasNextPage, onClickVote, onLoadMore }: VoteFeedListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore?.();
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, onLoadMore]);

  if (votes.length === 0) {
    return <div className="py-10 text-center text-label-m text-grey-purple">표시할 투표가 없습니다.</div>;
  }

  return (
    <div
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)",
      }}
    >
      <div className="space-y-6">
        {votes.map((vote) => (
          <VoteCard key={vote.voteId} vote={vote} onClick={onClickVote} />
        ))}
      </div>
      <div ref={sentinelRef} />
    </div>
  );
}
