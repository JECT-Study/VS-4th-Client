import { WithdrawalPage } from "@features/mypage/ui/WithdrawalPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mypage/withdrawal")({
  component: WithdrawalPage,
});
