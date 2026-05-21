import { createFileRoute } from '@tanstack/react-router';
import { WithdrawalPage } from '@features/mypage/ui/WithdrawalPage';

export const Route = createFileRoute('/mypage/withdrawal')({
    component: WithdrawalPage,
});