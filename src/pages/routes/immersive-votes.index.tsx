import { immersiveFeedQueryOptions } from "@features/immersive-vote/api/immersiveFeedQuery";
import { ImmersiveVotePage } from "@features/immersive-vote/ui/ImmersiveVotePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/immersive-votes/")({
  validateSearch: (search) => ({
    startVoteId: search.startVoteId != null ? Number(search.startVoteId) : undefined,
  }),
  loaderDeps: ({ search: { startVoteId } }) => ({ startVoteId }),
  loader: ({ context: { queryClient }, deps: { startVoteId } }) =>
    queryClient.prefetchQuery(immersiveFeedQueryOptions(startVoteId)),
  component: ImmersiveVotePage,
});
