import { useNavigate } from "@tanstack/react-router";

interface ChatRoomHeaderProps {
  title: string;
  participantCount: number;
}

export function ChatRoomHeader({ title, participantCount }: ChatRoomHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 flex items-center px-1 py-[6px] bg-white h-14 border-grey-stroke">
      <button
        type="button"
        onClick={() => navigate({ to: "/chat" })}
        className="flex items-center justify-center h-11 w-11"
        aria-label="뒤로가기"
      >
        <img src="/assets/icons/arrow-left.svg" alt="" className="w-6 h-6" />
      </button>

      <div className="flex items-center flex-1 min-w-0 gap-1 ml-[2px]">
        <h1 className="min-w-0 truncate text-title-m text-grey-black">{title}</h1>
        <span className="shrink-0 text-title-m text-grey-light pr-[70px]">{participantCount}</span>
      </div>
    </header>
  );
}
