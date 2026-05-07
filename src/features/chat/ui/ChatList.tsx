import type { ChatVoteItem } from "../model/types";
import { ChatListItem } from "./ChatListItem";

interface ChatListProps {
  items: ChatVoteItem[];
  onClickItem?: (id: number) => void;
}

export function ChatList({ items, onClickItem }: ChatListProps) {
  return (
    <div>
      {items.map((item) => (
        <ChatListItem key={`${item.status}-${item.id}`} item={item} onClick={onClickItem} />
      ))}
    </div>
  );
}
