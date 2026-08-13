interface SwipeNextVoteHintProps {
  isVisible: boolean;
}

export function SwipeNextVoteHint({ isVisible }: SwipeNextVoteHintProps) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-[6px] z-50 flex h-5 items-center justify-center"
      aria-live="polite"
    >
      {isVisible && (
        <p className="animate-immersive-swipe-hint text-label-s text-[#E7E5EB]">스와이프해서 다음 투표 보기</p>
      )}
    </div>
  );
}
