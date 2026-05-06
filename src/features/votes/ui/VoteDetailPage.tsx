import { Spinner } from "@base/ui/Spinner";
import { useVoteDetail } from "../model/useVoteDetail";
import { VoteContent } from "./VoteContent";
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
  } = useVoteDetail(voteId);

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative">
      <VoteHeader isEnded={isEnded} />

      <main className="pb-32" style={{ paddingBottom: "calc(8rem + env(safe-area-inset-bottom, 0px))" }}>
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
            onOptionClick={handleOptionClick}
            onCancel={() => cancelMutation.mutate()}
            isCancelPending={cancelMutation.isPending}
            isParticipatePending={participateMutation.isPending}
          />
          <VoteReactionBar
            emojiList={emojiList}
            commentCount={data?.commentCount}
            onEmojiClick={(type) => emojiMutation.mutate(type)}
            isEmojiPending={emojiMutation.isPending}
          />
        </div>

        {isEnded && result && (
          <VoteInsightSection
            resultOptions={result.result.options}
            insightPrimaryOptionId={insightPrimaryOptionId}
            voteUserType={voteUserType}
            genderChartProps={genderChartProps}
            ageGroups={ageGroups}
            aiInsight={result.aiInsight}
          />
        )}
      </main>

      {isEnded && (
        <footer
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 pt-[6px] flex gap-2 bg-white"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 6px)",
            boxShadow: "0px -1px 4px 0px rgba(0, 0, 0, 0.05)",
          }}
        >
          <button type="button" className="flex-[1.5] py-4 text-center text-body-m text-white bg-primary rounded-lg">
            채팅 바로가기
          </button>
          <button
            type="button"
            className="flex-1 py-4 text-center text-body-m text-grey-light border border-grey-stroke rounded-lg"
          >
            공유하기
          </button>
        </footer>
      )}
    </div>
  );
}
