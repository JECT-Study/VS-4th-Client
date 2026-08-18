import { useSearch } from "@tanstack/react-router";
import { useImmersiveFeed } from "../model/useImmersiveFeed";
import { useSwipeNextVoteHint } from "../model/useSwipeNextVoteHint";
import { ImmersiveVoteCard } from "./ImmersiveVoteCard";
import { ImmersiveVoteErrorPage } from "./ImmersiveVoteErrorPage";

export function ImmersiveVotePage() {
  const { startVoteId, startVoteSeq } = useSearch({ from: "/immersive-votes/" });
  const {
    votes,
    displayedVotes,
    currentVote,
    updateVote,
    handleTouchStart,
    handleTouchEnd,
    containerRef,
    handleTrackTransitionEnd,
    trackClassName,
    trackStyle,
    variant,
    isLoading,
    isError,
  } = useImmersiveFeed(startVoteId, startVoteSeq);
  const isSwipeHintVisible = useSwipeNextVoteHint(currentVote?.myVote.voted === true);

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
          <ImmersiveVoteCard
            key={`${vote.voteId}-${index}`}
            vote={vote}
            variant={variant}
            // displayedVotes는 무한 캐러셀용으로 피드를 두 번 이어붙인 배열이라 원본 순서로 환산한다.
            position={index % votes.length}
            updateVote={updateVote}
            isSwipeHintVisible={isSwipeHintVisible && vote.voteId === currentVote.voteId}
          />
        ))}
      </div>
    </main>
  );
}
