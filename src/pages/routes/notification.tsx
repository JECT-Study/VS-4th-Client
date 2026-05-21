import { createFileRoute } from '@tanstack/react-router';
import { NotificationPage } from '@features/notification/ui/NotificationPage';

export const Route = createFileRoute('/notification')({
    component: NotificationPage,
});