import type { VoteItem } from "../model/home.ts";

interface TodayRecommendationSliderProps {
  votes: VoteItem[];
  onClickVote?: (voteId: number) => void;
}

export function TodayRecommendationSlider({ votes, onClickVote }: TodayRecommendationSliderProps) {
  if (votes.length === 0) {
    return null;
  }

  return (
    <section className="px-5 pt-2">
      <h2 className="mb-3 text-title-m text-grey-black">오늘의 추천</h2>

      <div className="flex gap-3 pb-2 overflow-x-auto scrollbar-hide">
        {votes.map((vote) => (
          <button
            type="button"
            key={vote.id}
            onClick={() => onClickVote?.(vote.id)}
            className="w-[178px] shrink-0 text-left"
          >
            <div className="mb-2 aspect-[1.35/1] overflow-hidden rounded-xl bg-grey-divider">
              <img
                src={vote.thumbnailUrl}
                alt={vote.title}
                className="object-cover w-full h-full"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>

            <p className="line-clamp-1 text-label-l text-grey-black">{vote.title}</p>

            <p className="mt-1 line-clamp-1 text-label-m text-grey-light">{vote.description}</p>

            <p className="mt-1 text-label-s text-grey-light">◷ {vote.remainingTime}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
