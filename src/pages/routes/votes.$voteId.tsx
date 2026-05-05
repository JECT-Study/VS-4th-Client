import { VoteDetailPage } from "@features/votes/ui/VoteDetailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/votes/$voteId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { voteId } = Route.useParams();
  return <VoteDetailPage voteId={voteId} />;
}
