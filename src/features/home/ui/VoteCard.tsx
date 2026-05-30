import type { VoteItem } from "../model/home.ts";
import { VoteTimeCountdown } from "./VoteTimeCountdown.tsx";

interface VoteCardProps {
  vote: VoteItem;
  onClick?: (voteId: number) => void;
}

export function VoteCard({ vote, onClick }: VoteCardProps) {
  return (
    <button type="button" onClick={() => onClick?.(vote.voteId)} className="flex w-full gap-7 text-left">
      <div className="flex-1 min-w-0">
        <p className="line-clamp-1 text-body-m mb-[2px] text-grey-black">{vote.title}</p>

        <p className="line-clamp-1 text-label-m text-grey-dark">{vote.content}</p>

        <div className="flex items-center gap-1 text-grey-light mt-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <title>남은 시간</title>
            <circle cx="8" cy="8" r="5.4" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 5V8L10.2 10.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <VoteTimeCountdown endAt={vote.endAt} />
        </div>
      </div>

      <div className="w-[74px] h-[74px] overflow-hidden rounded-lg shrink-0 bg-grey-divider">
        <img
          src={vote.thumbnailUrl}
          alt=""
          className="object-cover w-full h-full"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </div>
    </button>
  );
}
