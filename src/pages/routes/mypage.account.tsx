import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mypage/account")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/mypage/account"!</div>;
}
