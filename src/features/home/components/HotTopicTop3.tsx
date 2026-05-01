import type { VoteItem } from "../types/home";

interface HotTopicTop3Props {
  votes: VoteItem[];
  onClickVote?: (voteId: number) => void;
}

export function HotTopicTop3({ votes, onClickVote }: HotTopicTop3Props) {
  if (votes.length === 0) {
    return null;
  }

  return (
    <section className="px-5 pt-7">
      <h2 className="mb-4 text-title-m text-grey-black">핫토픽 TOP 3</h2>

      <div className="space-y-4">
        {votes.slice(0, 3).map((vote, index) => (
          <button
            type="button"
            key={vote.id}
            onClick={() => onClickVote?.(vote.id)}
            className="flex items-center w-full gap-3 text-left"
          >
            <span className="w-4 text-label-l text-primary">{index + 1}</span>

            <div className="flex-1 min-w-0">
              <p className="line-clamp-1 text-body-m text-grey-black">{vote.title}</p>

              <p className="mt-1 line-clamp-1 text-label-m text-grey-light">{vote.description}</p>

              <div className="flex items-center gap-3 mt-2 text-label-s text-grey-purple">
                <span>◷ {vote.remainingTime}</span>
                <span>♙ {vote.participantCount}</span>
              </div>
            </div>

            <div className="w-16 h-16 overflow-hidden rounded-lg shrink-0 bg-grey-divider">
              <img src={vote.thumbnailUrl} alt={vote.title} className="object-cover w-full h-full" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
