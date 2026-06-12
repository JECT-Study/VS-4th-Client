interface HomeHeaderProps {
  hasUnreadNotification?: boolean;
  onClickNotification?: () => void;
}

export function HomeHeader({ hasUnreadNotification = false, onClickNotification }: HomeHeaderProps) {
  const notificationIconSrc = hasUnreadNotification ? "/assets/icons/bell-undread.svg" : "/assets/icons/bell.svg";

  return (
    <header className="fixed top-0 z-20 flex items-center justify-between w-full max-w-md px-5 -translate-x-1/2 bg-white left-1/2 h-14">
      {/* 이미지 크기를 w-6 h-6으로 키우고, 하위 컨텐츠와 좌측 라인을 맞추기 위해 -ml-1.5 추가 */}
      <button type="button" aria-label="홈" className="flex items-center justify-center h-9 w-9 -ml-1.5">
        <img src="/assets/images/logo_118x118.png" alt="VS" className="object-contain w-6 h-6" />
      </button>

      {/* 우측 정렬 대칭을 위해 -mr-1.5 추가 */}
      <button
        type="button"
        aria-label="알림"
        onClick={onClickNotification}
        className="relative flex items-center justify-center h-9 w-9 -mr-1.5"
      >
        <img src={notificationIconSrc} alt="알림" className="w-6 h-6" />
      </button>
    </header>
  );
}
