import { useNavigate } from "@tanstack/react-router";

interface ChatRoomHeaderProps {
  title: string;
  participantCount: number;
}

export function ChatRoomHeader({ title, participantCount }: ChatRoomHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 px-5 bg-white border-b h-14 border-grey-stroke">
      <button
        type="button"
        onClick={() => navigate({ to: "/chat" })}
        className="text-title-m text-grey-black"
        aria-label="뒤로가기"
      >
        ‹
      </button>

      <h1 className="flex-1 min-w-0 truncate text-label-l text-grey-black">{title}</h1>
      <span className="text-label-l text-grey-light">{participantCount}</span>
    </header>
  );
}
