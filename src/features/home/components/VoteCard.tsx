import type { VoteItem } from "../types/home";

interface VoteCardProps {
  vote: VoteItem;
  onClick?: (voteId: number) => void;
}

export function VoteCard({ vote, onClick }: VoteCardProps) {
  return (
    <button type="button" onClick={() => onClick?.(vote.id)} className="flex w-full gap-3 py-2 text-left">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {vote.status === "ended" && (
            <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-semibold text-white">투표 종료</span>
          )}
          <p className="text-sm font-bold line-clamp-1 text-neutral-950">{vote.title}</p>
        </div>

        <p className="text-xs leading-5 line-clamp-2 text-neutral-500">{vote.description}</p>
        <p className="mt-2 text-xs text-neutral-400">◷ {vote.remainingTime}</p>
      </div>

      <div className="w-16 h-16 overflow-hidden rounded-lg shrink-0 bg-neutral-100">
        <img
          src={vote.thumbnailUrl}
          alt={vote.title}
          className="object-cover w-full h-full"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </div>
    </button>
  );
}
