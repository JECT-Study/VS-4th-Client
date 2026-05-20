import { HomeHeader } from "./components/HomeHeader";
import { HotTopicTop3 } from "./components/HotTopicTop3";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { TodayRecommendationSlider } from "./components/TodayRecommendationSlider";
import { VoteFeedList } from "./components/VoteFeedList";
import { VoteFilterBar } from "./components/VoteFilterBar";
import { allVotes, hotTopicVotes, todayRecommendations } from "./data/mockHomeData";
import { useScrollTopButton } from "./hooks/useScrollTopButton";
import { useVoteFilter } from "./hooks/useVoteFilter";

export function HomePage() {
  const { isVisible, scrollToTop } = useScrollTopButton();
  const { sortType, setSortType, excludeEnded, setExcludeEnded, filteredVotes } = useVoteFilter(allVotes);

  const handleClickVote = (voteId: number) => {
    console.log("vote detail", voteId);
    // TODO: 투표 상세 페이지 라우트 확정 후 연결
    // navigate({ to: `/votes/${voteId}` });
  };

  const handleClickNotification = () => {
    console.log("notification");
    // TODO: 회원/비회원 및 읽음 여부에 따라 알림 페이지 분기
    // navigate({ to: "/notifications" });
  };

  return (
    <main className="pb-20 bg-white min-h-dvh">
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
