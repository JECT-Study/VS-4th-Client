import { immersiveFeedQueryOptions } from "@features/immersive-vote/api/immersiveFeedQuery";
import { ImmersiveVotePage } from "@features/immersive-vote/ui/ImmersiveVotePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/immersive-votes/")({
  loader: ({ context: { queryClient } }) => queryClient.prefetchQuery(immersiveFeedQueryOptions()),
  component: ImmersiveVotePage,
});
