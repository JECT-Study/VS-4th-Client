import type { HotTopicItem } from "../model/home.ts";
import { VoteTimeCountdown } from "./VoteTimeCountdown.tsx";

interface HotTopicTop3Props {
  hotTopics: HotTopicItem[];
  onClickVote?: (voteId: number) => void;
}

export function HotTopicTop3({ hotTopics, onClickVote }: HotTopicTop3Props) {
  return (
    <section className="px-5 mt-14">
      <h2 className="mb-4 text-h-s text-grey-black">핫토픽 TOP 3</h2>

      {hotTopics.length > 0 ? (
        <div className="space-y-4">
          {hotTopics.map((item) => (
            <button
              type="button"
              key={item.voteId}
              onClick={() => onClickVote?.(item.voteId)}
              className="flex items-start w-full gap-4 text-left"
            >
              <span className="text-body-m text-primary">{item.rank}</span>

              <div className="flex-1 min-w-0">
                <p className="line-clamp-1 text-body-m text-grey-black">{item.title}</p>

                <p className="mt-[2px] line-clamp-1 text-label-m text-grey-dark">{item.content}</p>

                <div className="flex items-center gap-4 mt-3 text-label-s text-grey-light">
                  <div className="flex items-center gap-1 text-grey-light">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                      <title>남은 시간</title>
                      <circle cx="8" cy="8" r="5.4" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M8 5V8L10.2 10.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <VoteTimeCountdown endAt={item.endAt} />
                  </div>
                  <div className="flex items-center gap-1">
                    <img src="/assets/icons/pple.svg" alt="참여 인원 수" />
                    <span className="text-label-s text-grey-light">{item.participantCount}</span>
                  </div>
                </div>
              </div>

              <div className="w-[74px] h-[74px] overflow-hidden rounded-lg shrink-0 bg-grey-divider">
                <img src={item.thumbnailUrl} alt={item.title} className="object-cover w-full h-full" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-label-m text-grey-light">표시할 투표가 없습니다.</div>
      )}
    </section>
  );
}
