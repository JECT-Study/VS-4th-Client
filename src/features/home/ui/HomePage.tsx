import { HomeHeader } from "./HomeHeader.tsx";
import { HotTopicTop3 } from "./HotTopicTop3.tsx";
import { ScrollToTopButton } from "./ScrollToTopButton.tsx";
import { TodayRecommendationSlider } from "./TodayRecommendationSlider.tsx";
import { VoteFeedList } from "./VoteFeedList.tsx";
import { VoteFilterBar } from "./VoteFilterBar.tsx";
import { allVotes, hotTopicVotes, todayRecommendations } from "../config/mockHomeData.ts";
import { useScrollTopButton } from "../model/useScrollTopButton.ts";
import { useVoteFilter } from "../model/useVoteFilter.ts";
import {useNavigate} from "@tanstack/react-router";

export function HomePage() {
  const { isVisible, scrollToTop } = useScrollTopButton();
  const navigate = useNavigate();
  const { sortType, setSortType, excludeEnded, setExcludeEnded, filteredVotes } = useVoteFilter(allVotes);

  const handleClickVote = (voteId: number) => {
    console.log("vote detail", voteId);
    // TODO: 투표 상세 페이지 라우트 확정 후 연결
    // navigate({ to: `/votes/${voteId}` });
  };

  const handleClickNotification = () => {
    navigate({ to: "/notification" });
  };

  return (
    <main className="min-h-dvh bg-white pt-14 pb-20">
      <HomeHeader hasUnreadNotification onClickNotification={handleClickNotification} />

      <TodayRecommendationSlider votes={todayRecommendations} onClickVote={handleClickVote} />

      <HotTopicTop3 votes={hotTopicVotes} onClickVote={handleClickVote} />

      <section className="px-5 pt-8">
        <h2 className="mb-3 text-title-m text-grey-black">모든 투표</h2>

        <VoteFilterBar
          sortType={sortType}
          excludeEnded={excludeEnded}
          onChangeSortType={setSortType}
          onToggleExcludeEnded={() => setExcludeEnded((previous) => !previous)}
        />

        <VoteFeedList votes={filteredVotes} onClickVote={handleClickVote} />
      </section>

      <ScrollToTopButton isVisible={isVisible} onClick={scrollToTop} />

    </main>
  );
}
