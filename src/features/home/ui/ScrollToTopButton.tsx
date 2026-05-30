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
      className={`fixed bottom-24 right-[calc(50%-188px)] z-30 flex h-14 w-14 items-center justify-center bg-white shadow-md rounded-lg border border-grey-stroke transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <img src="/assets/icons/top-btn.svg" alt="" />
    </button>
  );
}
