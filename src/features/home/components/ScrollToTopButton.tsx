interface ScrollToTopButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

export function ScrollToTopButton({ isVisible, onClick }: ScrollToTopButtonProps) {
  return (
    <button
      type="button"
      aria-label="상단으로 이동"
      onClick={onClick}
      className={`fixed bottom-24 right-[calc(50%-188px)] z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-neutral-700 shadow-lg transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      ↑
    </button>
  );
}
