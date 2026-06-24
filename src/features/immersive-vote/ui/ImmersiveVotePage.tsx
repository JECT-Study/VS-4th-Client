import { useSearch } from "@tanstack/react-router";
import { useImmersiveFeed } from "../model/useImmersiveFeed";
import { ImmersiveVoteCard } from "./ImmersiveVoteCard";
import { ImmersiveVoteErrorPage } from "./ImmersiveVoteErrorPage";

export function ImmersiveVotePage() {
  const { startVoteId } = useSearch({ from: "/immersive-votes/" });
  const {
    displayedVotes,
    currentVote,
    updateVote,
    handleTouchStart,
    handleTouchEnd,
    containerRef,
    handleTrackTransitionEnd,
    trackClassName,
    trackStyle,
    isLoading,
    isError,
  } = useImmersiveFeed(startVoteId);

  if (isError) {
    return <ImmersiveVoteErrorPage />;
  }

  if (isLoading) {
    return <div className="flex h-dvh items-center justify-center bg-grey-black text-white/60">불러오는 중...</div>;
  }

  if (!currentVote) {
    return <div className="flex h-dvh items-center justify-center bg-grey-black text-white">투표가 없어요</div>;
  }

  return (
    <main
      ref={containerRef}
      className="relative h-dvh overflow-hidden overscroll-none bg-grey-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={trackClassName} style={trackStyle} onTransitionEnd={handleTrackTransitionEnd}>
        {displayedVotes.map((vote, index) => (
          <ImmersiveVoteCard key={`${vote.voteId}-${index}`} vote={vote} updateVote={updateVote} />
        ))}
      </div>
    </main>
  );
}
