import type { RecommendationItem } from "../model/home.ts";
import { VoteTimeCountdown } from "./VoteTimeCountdown.tsx";

interface TodayRecommendationSliderProps {
  recommendations: RecommendationItem[];
  onClickVote?: (voteId: number) => void;
}

export function TodayRecommendationSlider({ recommendations, onClickVote }: TodayRecommendationSliderProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="px-5 pt-4">
      <h2 className="mb-4 text-h-s text-grey-black">오늘의 추천</h2>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {recommendations.map((item) => (
          <button
            type="button"
            key={item.voteId}
            onClick={() => onClickVote?.(item.voteId)}
            className="w-[256px] shrink-0 text-left"
          >
            <div className="mb-4 aspect-[1.256/144] overflow-hidden rounded-xl bg-grey-divider">
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="object-cover w-full h-full"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>

            <p className="line-clamp-1 text-body-m text-grey-black">{item.title}</p>

            <p className="line-clamp-1 text-label-m text-grey-dark">{item.content}</p>

            <div className="flex items-center gap-1 text-grey-light mt-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <title>남은 시간</title>
                <circle cx="8" cy="8" r="5.4" stroke="currentColor" strokeWidth="1.2" />
                <path d="M8 5V8L10.2 10.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <VoteTimeCountdown endAt={item.endAt} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
