import { createFileRoute } from "@tanstack/react-router";

import { ChatListPage } from "@/features/chat/ui/ChatListPage";

export const Route = createFileRoute("/chat/")({
  component: ChatListPage,
});
