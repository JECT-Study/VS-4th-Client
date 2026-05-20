import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mypage")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
