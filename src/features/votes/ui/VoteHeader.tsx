export function VoteHeader({ isEnded }: { isEnded: boolean }) {
  return (
    <header className="px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button type="button">
          <img src="/assets/icons/arrow-left.svg" alt="뒤로가기" />
        </button>
        <h1 className="text-title-m text-grey-black">{isEnded ? "투표 마감 최종결과" : "투표 상세"}</h1>
      </div>

      {!isEnded && (
        <button type="button">
          <img src="/assets/icons/share.svg" alt="공유하기" />
        </button>
      )}
    </header>
  );
}
