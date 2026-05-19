import { useQuery } from "@tanstack/react-query";
import { getChatMessages } from "../api/chatApi";

export const useChatMessagesQuery = (voteId: number) => {
  return useQuery({
    queryKey: ["chat", voteId, "messages"],
    queryFn: () =>
      getChatMessages({
        voteId,
        size: 30,
      }),
    enabled: Number.isFinite(voteId),
  });
};
