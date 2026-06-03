import { apiClient } from "@base/api/client";
import { ChatApi } from "@ject-4-vs-team/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const chatApi = new ChatApi(undefined, undefined, apiClient);

export const markChatAsRead = async (voteId: number, lastReadMessageId: number) => {
  await chatApi.markAsRead1(voteId, { lastReadMessageId });
};

export const useMarkChatAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ voteId, lastReadMessageId }: { voteId: number; lastReadMessageId: number }) =>
      markChatAsRead(voteId, lastReadMessageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
