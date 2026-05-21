import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mypage/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/mypage/profile"!</div>;
}
