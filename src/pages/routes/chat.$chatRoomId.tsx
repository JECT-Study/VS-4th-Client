import { createFileRoute } from "@tanstack/react-router";

import { ChatRoomPage } from "@/features/chat/ui/ChatRoomPage";

export const Route = createFileRoute("/chat/$chatRoomId")({
  validateSearch: (search) => ({
    tab: search.tab === "ENDED" ? "ENDED" : search.tab === "ONGOING" ? "ONGOING" : undefined,
  }),
  component: ChatRoomPage,
});
