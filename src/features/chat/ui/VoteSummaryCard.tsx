import type { ChatRoomDetail } from "../model/types";

interface VoteSummaryCardProps {
  room: ChatRoomDetail;
}

export function VoteSummaryCard({ room }: VoteSummaryCardProps) {
  const [leftOption, rightOption] = room.options;

  return (
    <section className="sticky z-10 px-5 py-3 bg-white top-14">
      <div className="rounded-xl bg-white p-4 shadow-[0_6px_20px_rgba(19,19,19,0.08)]">
        <div className="flex items-center justify-between text-label-s">
          <span className="font-semibold text-secondary">
            {leftOption.ratio}% {leftOption.label}
          </span>
          <span className="font-semibold text-primary">
            {rightOption.ratio}% {rightOption.label}
          </span>
        </div>

        <div className="flex h-2 mt-2 overflow-hidden rounded-full bg-grey-stroke">
          <div className="bg-secondary" style={{ width: `${leftOption.ratio}%` }} />
          <div className="bg-primary" style={{ width: `${rightOption.ratio}%` }} />
        </div>

        <div className="flex items-center justify-between mt-3 text-label-s text-grey-light">
          <div className="flex items-center gap-1">
            <span>◷</span>
            <span>{room.status === "ended" ? "투표 종료" : room.remainingTime}</span>
          </div>

          <button type="button" className="text-grey-light">
            상세보기 ›
          </button>
        </div>
      </div>
    </section>
  );
}
