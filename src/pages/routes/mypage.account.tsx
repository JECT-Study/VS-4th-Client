import { AccountPage } from "@features/mypage/ui/AccountPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mypage/account")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AccountPage />;
}
