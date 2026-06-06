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
    <section className="sticky z-10 px-5 bg-white top-14">
      <div className="rounded-2xl bg-white p-4 shadow-[0px_5px_12px_2px_rgba(120,_120,_136,_0.06)] border border-grey-chat">
        <div className="flex items-center justify-between text-label-l gap-[6px]">
          <span className="text-label-l text-secondary flex items-center gap-[2px] max-w-[156px]">
            <span>{gauge.optionARatio}%</span>
            <span className="truncate">{header.optionA}</span>
          </span>
          <span className="text-label-l text-primary flex items-center gap-[2px] max-w-[156px]">
            <span>{gauge.optionBRatio}%</span>
            <span className="truncate">{header.optionB}</span>
          </span>
        </div>

        <div className="flex h-3 mt-2 overflow-hidden rounded-full bg-grey-stroke">
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
            {isEnded ? <span className="text-label-s">00:00:00</span> : <VoteTimeCountdown endAt={header.endAt} />}
          </div>

          <Link
            to="/votes/$voteId"
            params={{ voteId: String(header.voteId) }}
            className="flex items-center gap-1 text-grey-light"
          >
            <span className="text-label-s">상세보기</span>
            <img src="/assets/icons/arrow-right-s.svg" alt="" className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
