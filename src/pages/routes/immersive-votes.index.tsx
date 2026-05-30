import { showToast } from "@base/ui/Toast";
import { immersiveFeedQueryOptions } from "@features/immersive-vote/api/immersiveFeedQuery";
import { ImmersiveVotePage } from "@features/immersive-vote/ui/ImmersiveVotePage";
import { voteDetailQueryOptions } from "@features/votes/api/voteDetailQuery";
import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/immersive-votes/")({
  validateSearch: (search) => ({
    startVoteId: search.startVoteId != null ? Number(search.startVoteId) : undefined,
  }),
  loaderDeps: ({ search: { startVoteId } }) => ({ startVoteId }),
  loader: async ({ context: { queryClient }, deps: { startVoteId } }) => {
    if (startVoteId != null) {
      try {
        const vote = await queryClient.fetchQuery(voteDetailQueryOptions(String(startVoteId)));
        if (vote.status === "ENDED") {
          showToast.warning("이미 종료된 투표입니다");
          throw redirect({ to: "/votes/$voteId", params: { voteId: String(startVoteId) } });
        }
      } catch (e) {
        if (isRedirect(e)) throw e;
        return queryClient.prefetchQuery(immersiveFeedQueryOptions(undefined));
      }
    }
    return queryClient.prefetchQuery(immersiveFeedQueryOptions(startVoteId));
  },
  component: ImmersiveVotePage,
});
