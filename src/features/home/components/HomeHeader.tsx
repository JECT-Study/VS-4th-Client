interface HomeHeaderProps {
  hasUnreadNotification?: boolean;
  onClickNotification?: () => void;
}

export function HomeHeader({ hasUnreadNotification = false, onClickNotification }: HomeHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-5 bg-white h-14">
      <button type="button" aria-label="홈" className="flex items-center justify-center h-9 w-9">
        <img src="/assets/images/app/pwa-64x64.png" alt="VS" className="w-5 h-5" />
      </button>

      <button
        type="button"
        aria-label="알림"
        onClick={onClickNotification}
        className="relative flex items-center justify-center h-9 w-9"
      >
        <img src="/assets/icons/bell.svg" alt="알림" className="w-6 h-6" />

        {hasUnreadNotification && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />}
      </button>
    </header>
  );
}
