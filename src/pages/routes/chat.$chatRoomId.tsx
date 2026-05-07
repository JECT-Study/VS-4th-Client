import { createFileRoute } from "@tanstack/react-router";

import { ChatRoomPage } from "@/features/chat/ui/ChatRoomPage";

export const Route = createFileRoute("/chat/$chatRoomId")({
  component: ChatRoomPage,
});
