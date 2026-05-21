import { HomeHeader } from "@features/home/ui/HomeHeader.tsx";
import { HotTopicTop3 } from "@features/home/ui/HotTopicTop3.tsx";
import { ScrollToTopButton } from "@features/home/ui/ScrollToTopButton.tsx";
import { TodayRecommendationSlider } from "@features/home/ui/TodayRecommendationSlider.tsx";
import { VoteFeedList } from "@features/home/ui/VoteFeedList.tsx";
import { VoteFilterBar } from "@features/home/ui/VoteFilterBar.tsx";
import { allVotes, hotTopicVotes, todayRecommendations } from "@features/home/config/mockHomeData.ts";
import { useScrollTopButton } from "@features/home/model/useScrollTopButton.ts";
import { useVoteFilter } from "@features/home/model/useVoteFilter.ts";
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
