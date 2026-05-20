import { Link, useRouterState } from "@tanstack/react-router";
import { bottomTabs } from "@/features/home/data/mockHomeData";

export function BottomTabBar() {
  // 현재 접속 중인 URL 경로를 가져옵니다.
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
      <nav className="fixed bottom-0 z-20 grid w-full h-16 max-w-md grid-cols-4 pb-1 -translate-x-1/2 bg-white border-t left-1/2 border-grey-stroke">
        {bottomTabs.map((tab) => {
          // 현재 경로가 탭의 path로 시작하면 활성화된 것으로 간주 (예: /mypage/account 접속 시에도 마이 탭 활성화)
          const isActive = currentPath.startsWith(tab.path);
          const iconSrc = isActive ? tab.activeIcon : tab.icon;

          return (
              <Link
                  key={tab.key}
                  to={tab.path}
                  className={`flex flex-col items-center justify-center gap-1 text-label-s transition-colors ${
                      isActive ? "text-grey-black" : "text-grey-light"
                  }`}
              >
                <img src={iconSrc} alt={`${tab.label} 아이콘`} className="w-6 h-6" />
                <span>{tab.label}</span>
              </Link>
          );
        })}
      </nav>
  );
}