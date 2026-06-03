import { Link } from "@tanstack/react-router";
import { formatRemainingTime } from "../lib/formatChatTime";
import type { ChatGaugeResponse, ChatRoomHeaderResponse } from "../model/types";

interface VoteSummaryCardProps {
  header: ChatRoomHeaderResponse;
  gauge: ChatGaugeResponse;
}

export function VoteSummaryCard({ header, gauge }: VoteSummaryCardProps) {
  const isEnded = header.status === "ENDED";

  return (
    <section className="sticky z-10 px-5 py-3 bg-white top-14">
      <div className="rounded-xl bg-white p-4 shadow-[0_6px_20px_rgba(19,19,19,0.08)]">
        <div className="flex items-center justify-between text-label-s">
          <span className="font-semibold text-secondary">
            {gauge.optionARatio}% {header.optionA}
          </span>
          <span className="font-semibold text-primary">
            {gauge.optionBRatio}% {header.optionB}
          </span>
        </div>

        <div className="flex h-2 mt-2 overflow-hidden rounded-full bg-grey-stroke">
          <div className="bg-secondary" style={{ width: `${gauge.optionARatio}%` }} />
          <div className="bg-primary" style={{ width: `${gauge.optionBRatio}%` }} />
        </div>

        <div className="flex items-center justify-between mt-3 text-label-s text-grey-light">
          <div className="flex items-center gap-1">
            <span>◷</span>
            <span>{isEnded ? "투표 종료" : formatRemainingTime(header.endAt)}</span>
          </div>

          <Link to="/votes/$voteId" params={{ voteId: String(header.voteId) }} className="text-grey-light">
            상세보기 ›
          </Link>
        </div>
      </div>
    </section>
  );
}
