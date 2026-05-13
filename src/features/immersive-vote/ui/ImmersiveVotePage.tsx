import { BottomTabBar } from "@features/common/ui/BottomTabBar";
import { useImmersiveFeed } from "../model/useImmersiveFeed";
import { ImmersiveVoteCard } from "./ImmersiveVoteCard";

export function ImmersiveVotePage() {
  const {
    displayedVotes,
    currentVote,
    updateVote,
    handleTouchStart,
    handleTouchEnd,
    handleWheel,
    handleTrackTransitionEnd,
    trackClassName,
    trackStyle,
    isLoading,
  } = useImmersiveFeed();

  if (isLoading) {
    return <div className="flex h-dvh items-center justify-center bg-grey-black text-white/60">불러오는 중...</div>;
  }

  if (!currentVote) {
    return <div className="flex h-dvh items-center justify-center bg-grey-black text-white">투표가 없어요</div>;
  }

  return (
    <main
      className="relative h-dvh overflow-hidden bg-grey-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <div className={trackClassName} style={trackStyle} onTransitionEnd={handleTrackTransitionEnd}>
        {displayedVotes.map((vote, index) => (
          <ImmersiveVoteCard key={`${vote.voteId}-${index}`} vote={vote} updateVote={updateVote} />
        ))}
      </div>
      <BottomTabBar activeTab="vote" />
    </main>
  );
}
