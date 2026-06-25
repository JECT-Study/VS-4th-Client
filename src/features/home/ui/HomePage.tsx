import { userQueryOptions } from "@features/auth/api/userQuery";
import { useHomeHotTopicsQuery } from "@features/home/api/homeHotTopicsQuery.ts";
import { useHomeRecommendationsQuery } from "@features/home/api/homeRecommendationsQuery.ts";
import { useHomeVotesQuery } from "@features/home/api/homeVotesQuery.ts";
import { useScrollTopButton } from "@features/home/model/useScrollTopButton.ts";
import { useVoteFilter } from "@features/home/model/useVoteFilter.ts";
import { HomeHeader } from "@features/home/ui/HomeHeader.tsx";
import { HotTopicTop3 } from "@features/home/ui/HotTopicTop3.tsx";
import { ScrollToTopButton } from "@features/home/ui/ScrollToTopButton.tsx";
import { TodayRecommendationSlider } from "@features/home/ui/TodayRecommendationSlider.tsx";
import { VoteFeedList } from "@features/home/ui/VoteFeedList.tsx";
import { VoteFilterBar } from "@features/home/ui/VoteFilterBar.tsx";
import { useNotificationUnreadCountQuery } from "@features/notification/api/notificationQueries";
import { NotificationAuthRequiredModal } from "@features/notification/ui/NotificationAuthRequiredModal";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export function HomePage() {
  const { isVisible, scrollToTop } = useScrollTopButton();
  const [isNotificationAuthModalOpen, setIsNotificationAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const { sortType, setSortType, excludeEnded, changeExcludeEnded } = useVoteFilter();

  const { data: votesData, hasNextPage, fetchNextPage } = useHomeVotesQuery(sortType, excludeEnded);
  const { data: recommendationsData } = useHomeRecommendationsQuery();
  const { data: hotTopicsData } = useHomeHotTopicsQuery();
  const { data: user, isPending: isUserPending } = useQuery(userQueryOptions());
  const { data: unreadNotificationCount = 0 } = useNotificationUnreadCountQuery(!!user);

  const allVotes = votesData?.pages.flatMap((page) => page.votes) ?? [];
  const recommendations = recommendationsData?.recommendations ?? [];
  const hotTopics = hotTopicsData?.hotTopics ?? [];

  const handleClickVote = (voteId: number) => {
    navigate({ to: `/votes/${voteId}` });
  };

  const handleClickNotification = () => {
    if (!isUserPending && !user) {
      setIsNotificationAuthModalOpen(true);
      return;
    }

    navigate({ to: "/notification" });
  };

  return (
    <main
      className="min-h-dvh bg-white pt-14"
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)",
      }}
    >
      <HomeHeader hasUnreadNotification={unreadNotificationCount > 0} onClickNotification={handleClickNotification} />

      <TodayRecommendationSlider recommendations={recommendations} onClickVote={handleClickVote} />

      <HotTopicTop3 hotTopics={hotTopics} onClickVote={handleClickVote} />

      <section className="px-5 pt-14">
        <h2 className="mb-3 text-h-s text-grey-black">모든 투표</h2>

        <VoteFilterBar
          sortType={sortType}
          excludeEnded={excludeEnded}
          onChangeSortType={setSortType}
          onChangeExcludeEnded={changeExcludeEnded}
        />

        <VoteFeedList
          votes={allVotes}
          hasNextPage={hasNextPage}
          onClickVote={handleClickVote}
          onLoadMore={fetchNextPage}
        />
      </section>

      <ScrollToTopButton isVisible={isVisible} onClick={scrollToTop} />

      <NotificationAuthRequiredModal
        isOpen={isNotificationAuthModalOpen}
        onClose={() => setIsNotificationAuthModalOpen(false)}
      />
    </main>
  );
}
