import { VoteTimeCountdown } from "@features/home/ui/VoteTimeCountdown";
import { Link } from "@tanstack/react-router";
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
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
              <title>남은 시간</title>
              <circle cx="8" cy="8" r="5.4" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8 5V8L10.2 10.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {isEnded ? <span>00:00:00</span> : <VoteTimeCountdown endAt={header.endAt} />}
          </div>

          <Link
            to="/votes/$voteId"
            params={{ voteId: String(header.voteId) }}
            className="flex items-center gap-1 text-grey-light"
          >
            <span>상세보기</span>
            <img src="/assets/icons/arrow-right-s.svg" alt="" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
