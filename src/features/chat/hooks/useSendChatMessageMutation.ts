import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendChatMessage } from "../api/chatApi";

export const useSendChatMessageMutation = (voteId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => sendChatMessage(voteId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chat", voteId, "messages"],
      });

      queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
    },
  });
};
