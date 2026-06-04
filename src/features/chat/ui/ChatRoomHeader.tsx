import { useNavigate } from "@tanstack/react-router";

interface ChatRoomHeaderProps {
  title: string;
  participantCount: number;
}

export function ChatRoomHeader({ title, participantCount }: ChatRoomHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 flex items-center px-5 bg-white h-14 border-grey-stroke">
      <button
        type="button"
        onClick={() => navigate({ to: "/chat" })}
        className="flex items-center justify-center -ml-2 h-11 w-11"
        aria-label="뒤로가기"
      >
        <img src="/assets/icons/arrow-left.svg" alt="" className="w-6 h-6" />
      </button>

      <div className="flex items-center flex-1 min-w-0 gap-1 ml-2">
        <h1 className="min-w-0 truncate text-title-s text-grey-black">{title}</h1>
        <span className="shrink-0 text-title-m text-grey-light">{participantCount}</span>
      </div>
    </header>
  );
}
