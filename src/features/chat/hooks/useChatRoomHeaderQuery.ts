import { useQuery } from "@tanstack/react-query";
import { getChatRoomHeader } from "../api/chatApi";

export const useChatRoomHeaderQuery = (voteId: number) => {
  return useQuery({
    queryKey: ["chat", voteId, "header"],
    queryFn: () => getChatRoomHeader(voteId),
    enabled: Number.isFinite(voteId),
  });
};
