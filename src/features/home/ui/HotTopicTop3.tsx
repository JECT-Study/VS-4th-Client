import { formatRemainingTime } from "../lib/formatRemainingTime.ts";
import type { HotTopicItem } from "../model/home.ts";

interface HotTopicTop3Props {
  hotTopics: HotTopicItem[];
  onClickVote?: (voteId: number) => void;
}

export function HotTopicTop3({ hotTopics, onClickVote }: HotTopicTop3Props) {
  if (hotTopics.length === 0) {
    return null;
  }

  return (
    <section className="px-5 mt-14">
      <h2 className="mb-4 text-h-s text-grey-black">핫토픽 TOP 3</h2>

      <div className="space-y-4">
        {hotTopics.map((item) => (
          <button
            type="button"
            key={item.voteId}
            onClick={() => onClickVote?.(item.voteId)}
            className="flex items-start w-full gap-3 text-left"
          >
            <span className="w-4 text-body-m text-primary">{item.rank}</span>

            <div className="flex-1 min-w-0">
              <p className="line-clamp-1 text-body-m text-grey-black">{item.title}</p>

              <p className="mt-1 line-clamp-1 text-label-m text-grey-light">{item.content}</p>

              <div className="flex items-center gap-3 mt-2 text-label-s text-grey-purple">
                <span>◷ {formatRemainingTime(item.endAt)}</span>
                <span>♙ {item.participantCount}</span>
              </div>
            </div>

            <div className="w-16 h-16 overflow-hidden rounded-lg shrink-0 bg-grey-divider">
              <img src={item.thumbnailUrl} alt={item.title} className="object-cover w-full h-full" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
