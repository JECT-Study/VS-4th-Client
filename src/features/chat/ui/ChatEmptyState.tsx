interface ChatEmptyStateProps {
  title?: string;
  description?: string;
}

export function ChatEmptyState({
  title = "아직 참여한 투표가 없어요!",
  description = "마음에 드는 주제에 가볍게 투표하면\n실시간 채팅방에 입장할 수 있어요",
}: ChatEmptyStateProps) {
  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center px-5 text-center">
      <h2 className="text-title-m text-grey-black">{title}</h2>
      <p className="mt-4 whitespace-pre-line text-body-s text-grey-light">{description}</p>
    </div>
  );
}
