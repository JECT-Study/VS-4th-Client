import { Spinner } from "@base/ui/Spinner";
import { useVoteDetail } from "../model/useVoteDetail";
import FreeVoteLimitModal from "./FreeVoteLimitModal";
import PushNotificationPromptModal from "./PushNotificationPromptModal";
import { VoteContent } from "./VoteContent";
import VoteFooter from "./VoteFooter";
import { VoteHeader } from "./VoteHeader";
import { VoteInsightSection } from "./VoteInsightSection";
import { VoteOptionsSection } from "./VoteOptionsSection";
import { VoteReactionBar } from "./VoteReactionBar";

export function VoteDetailPage({ voteId }: { voteId: string }) {
  const {
    data,
    result,
    isEnded,
    isInitialLoading,
    voteUserType,
    insightPrimaryOptionId,
    genderChartProps,
    ageGroups,
    emojiList,
    handleOptionClick,
    cancelMutation,
    emojiMutation,
    participateMutation,
    isFreeVoteLimitModalOpen,
    setIsFreeVoteLimitModalOpen,
    isPushPromptOpen,
    handlePushPromptDismiss,
  } = useVoteDetail(voteId);

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const hasFooter = isEnded && voteUserType !== "guest";

  return (
    <div className="relative">
      <VoteHeader isEnded={isEnded} />

      <main style={{ paddingBottom: `calc(${hasFooter ? "8rem" : "2rem"} + env(safe-area-inset-bottom, 0px))` }}>
        <div className="px-5 py-4">
          <VoteContent
            title={data?.title}
            createdAt={data?.createdAt}
            content={data?.content}
            thumbnailUrl={data?.thumbnailUrl}
          />
          <VoteOptionsSection
            options={data?.options}
            myVote={data?.myVote}
            participantCount={data?.participantCount}
            endAt={data?.endAt}
            isEnded={isEnded}
            onOptionClick={handleOptionClick}
            onCancel={() => cancelMutation.mutate()}
            isCancelPending={cancelMutation.isPending}
            isParticipatePending={participateMutation.isPending}
          />
          {!isEnded && (
            <VoteReactionBar
              voteId={voteId}
              emojiList={emojiList}
              commentCount={data?.commentCount}
              onEmojiClick={(type) => emojiMutation.mutate(type)}
              isEmojiPending={emojiMutation.isPending}
              voteUserType={voteUserType}
            />
          )}
        </div>

        {isEnded && result && (
          <VoteInsightSection
            resultOptions={result.result.options}
            insightPrimaryOptionId={insightPrimaryOptionId}
            voteUserType={voteUserType}
            genderChartProps={genderChartProps}
            ageGroups={ageGroups}
            aiInsight={result.aiInsight}
            participantCount={result.participantCount}
          />
        )}
      </main>

      {hasFooter && <VoteFooter voteId={voteId} />}

      <FreeVoteLimitModal isOpen={isFreeVoteLimitModalOpen} onClose={() => setIsFreeVoteLimitModalOpen(false)} />
      <PushNotificationPromptModal isOpen={isPushPromptOpen} onClose={handlePushPromptDismiss} />
    </div>
  );
}
