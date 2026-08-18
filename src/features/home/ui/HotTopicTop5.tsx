import type { HotTopicItem } from "../model/home.ts";
import { VoteTimeCountdown } from "./VoteTimeCountdown.tsx";

interface HotTopicTop5Props {
  hotTopics: HotTopicItem[];
  onClickVote?: (voteId: number, rank: number) => void;
}

function HotTopicMeta({ item }: { item: HotTopicItem }) {
  return (
    <div className="flex items-center gap-4 text-label-s text-grey-light">
      <div className="flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <title>남은 시간</title>
          <circle cx="8" cy="8" r="5.4" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8 5V8L10.2 10.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <VoteTimeCountdown endAt={item.endAt} />
      </div>

      <div className="flex items-center gap-1">
        <img src="/assets/icons/pple.svg" alt="참여 인원 수" />
        <span>{item.participantCount}</span>
      </div>
    </div>
  );
}

function HotTopicThumbnail({ item, className }: { item: HotTopicItem; className: string }) {
  return (
    <div className={`${className} overflow-hidden bg-grey-divider`}>
      {item.thumbnailUrl && (
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          className="h-full w-full object-cover text-transparent"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}
    </div>
  );
}

export function HotTopicTop5({ hotTopics, onClickVote }: HotTopicTop5Props) {
  const rankedHotTopics = [...hotTopics]
    .filter((item) => item.rank >= 1 && item.rank <= 5)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 5);
  const carouselItems = rankedHotTopics.filter((item) => item.rank <= 3);
  const listItems = rankedHotTopics.filter((item) => item.rank >= 4);

  return (
    <section className="px-5 pt-4">
      <h2 className="mb-4 text-h-s text-grey-black">핫토픽 TOP 5</h2>

      {rankedHotTopics.length > 0 ? (
        <>
          {carouselItems.length > 0 && (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {carouselItems.map((item) => (
                <button
                  type="button"
                  key={item.voteId}
                  onClick={() => onClickVote?.(item.voteId, item.rank)}
                  className="w-[256px] shrink-0 text-left"
                >
                  <div className="relative mb-4">
                    <HotTopicThumbnail item={item} className="aspect-[256/144] w-full rounded-xl" />
                    <span className="absolute left-0 top-0 flex size-8 items-center justify-center rounded-tl-xl bg-primary text-body-m text-white">
                      {item.rank}
                    </span>
                  </div>

                  <p className="line-clamp-1 text-body-m text-grey-black">{item.title}</p>
                  <p className="line-clamp-1 text-label-m text-grey-dark">{item.content}</p>

                  <div className="mt-2">
                    <HotTopicMeta item={item} />
                  </div>
                </button>
              ))}
            </div>
          )}

          {listItems.length > 0 && (
            <div className="mt-6 space-y-4">
              {listItems.map((item) => (
                <button
                  type="button"
                  key={item.voteId}
                  onClick={() => onClickVote?.(item.voteId, item.rank)}
                  className="flex w-full items-start gap-4 text-left"
                >
                  <span className="text-body-m text-primary">{item.rank}</span>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-body-m text-grey-black">{item.title}</p>
                    <p className="mt-[2px] line-clamp-1 text-label-m text-grey-dark">{item.content}</p>

                    <div className="mt-3">
                      <HotTopicMeta item={item} />
                    </div>
                  </div>

                  <HotTopicThumbnail item={item} className="h-[74px] w-[74px] shrink-0 rounded-lg" />
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="py-10 text-center text-label-m text-grey-light">표시할 투표가 없습니다.</div>
      )}
    </section>
  );
}
