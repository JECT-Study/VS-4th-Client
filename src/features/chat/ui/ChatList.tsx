import type { ChatListItemResponse, ChatTabType } from "../model/types";
import { ChatListItem } from "./ChatListItem";

interface ChatListProps {
  items: ChatListItemResponse[];
  status: ChatTabType;
  onClickItem?: (id: number) => void;
}

export function ChatList({ items, status, onClickItem }: ChatListProps) {
  return (
    <div>
      {items.map((item) => (
        <ChatListItem key={`${status}-${item.voteId}`} item={item} status={status} onClick={onClickItem} />
      ))}
    </div>
  );
}
