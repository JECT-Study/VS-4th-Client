import { NotificationPage } from "@features/notification/ui/NotificationPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/notification")({
  component: NotificationPage,
});
