import { SortDropdown } from "@base/ui/SortDropdown";
import {
  type ActiveVoteSortType,
  activeParticipatedVotesQueryOptions,
} from "@features/mypage/api/participatedVotesQuery";
import { VoteTimeRemaining } from "@features/votes/ui/VoteTimeRemaining";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

const sortingOptions: Array<{ value: ActiveVoteSortType; label: string }> = [
  { value: "END_AT", label: "종료 임박순" },
  { value: "LATEST", label: "최신순" },
  { value: "POPULAR", label: "인기순" },
];

export function ActiveParticipatedVoteList() {
  const [sortingOption, setSortingOption] = useState<ActiveVoteSortType>(sortingOptions[0]!.value);
  const { data } = useQuery(activeParticipatedVotesQueryOptions(sortingOption));

  const voteList = data?.voteList ?? [];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between">
        <span className="text-label-m text-grey-light">총 {data?.count ?? 0}개</span>

        <SortDropdown options={sortingOptions} value={sortingOption} onChange={(value) => setSortingOption(value)} />
      </div>

      {voteList.length === 0 ? (
        <div className="flex-1 flex items-center flex-col justify-center">
          <h2 className="text-h-s">아직 참여한 투표가 없어요!</h2>
          <p className="text-title-s text-grey-light mt-4 text-center">
            투표에 참여하면
            <br />
            이곳에 차곡차곡 기록이 쌓여요
          </p>
          <Link
            to="/immersive-votes"
            search={{
              startVoteId: undefined,
            }}
            className="py-3 px-5 text-title-m flex items-center gap-2 mt-10 border border-grey-disabled rounded-[100px]"
          >
            <span>투표 참여하러 가기</span>
            <img src="/assets/icons/arrow-right.svg" alt="" />
          </Link>
        </div>
      ) : (
        <ol
          className="mt-4 flex flex-col gap-6 flex-1 overflow-auto"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)",
          }}
        >
          {voteList.map((item) => (
            <Link
              key={item.id}
              to="/immersive-votes"
              search={{ startVoteId: item.id }}
              className="flex items-center gap-7 justify-between"
            >
              <div className="overflow-hidden">
                <span className="text-body-m">{item.title}</span>
                <p className="text-label-m w-full truncate text-grey-dark mt-[2px]">{item.content}</p>
                <div className="flex items-center gap-1 text-grey-light mt-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                    <title>남은 시간</title>
                    <circle cx="8" cy="8" r="5.4" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M8 5V8L10.2 10.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <VoteTimeRemaining endAt={item.endAt} />
                </div>
              </div>

              <img src={item.thumbnailUrl} alt="" className="w-[74px] h-[74px] rounded-lg overflow-hidden shrink-0" />
            </Link>
          ))}
        </ol>
      )}
    </div>
  );
}
