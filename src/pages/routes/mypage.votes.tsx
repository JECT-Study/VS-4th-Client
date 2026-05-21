import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mypage/votes")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/mypage/votes"!</div>;
}
