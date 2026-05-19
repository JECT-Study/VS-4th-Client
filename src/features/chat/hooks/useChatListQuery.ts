import { useQuery } from "@tanstack/react-query";
import { getChats } from "../api/chatApi";
import type { ChatTabType } from "../model/types";

export const useChatListQuery = (status: ChatTabType) => {
  return useQuery({
    queryKey: ["chats", status],
    queryFn: () => getChats(status),
  });
};
