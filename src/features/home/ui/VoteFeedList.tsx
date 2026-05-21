import type { VoteItem } from "../model/home.ts";
import { VoteCard } from "./VoteCard.tsx";

interface VoteFeedListProps {
  votes: VoteItem[];
  onClickVote?: (voteId: number) => void;
}

export function VoteFeedList({ votes, onClickVote }: VoteFeedListProps) {
  if (votes.length === 0) {
    return <div className="py-10 text-center text-label-m text-grey-purple">표시할 투표가 없습니다.</div>;
  }

  return (
    <div className="space-y-2">
      {votes.map((vote) => (
        <VoteCard key={vote.id} vote={vote} onClick={onClickVote} />
      ))}
    </div>
  );
}
