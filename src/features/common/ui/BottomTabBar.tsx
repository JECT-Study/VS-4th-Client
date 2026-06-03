import { bottomTabs } from "@features/common/config/bottomTabs.ts";
import { Link, useRouterState } from "@tanstack/react-router";

export function BottomTabBar() {
  // 현재 접속 중인 URL 경로를 가져옵니다.
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const isImmersiveVotePath = currentPath.startsWith("/immersive-votes");

  return (
    <nav
      className={`fixed bottom-0 z-20 grid h-16 w-full max-w-md -translate-x-1/2 grid-cols-4 border-t pb-1 left-1/2 ${
        isImmersiveVotePath ? "border-grey-black bg-grey-black" : "border-grey-stroke bg-white"
      }`}
    >
      {bottomTabs.map((tab) => {
        // 현재 경로가 탭의 path로 시작하면 활성화된 것으로 간주 (예: /mypage/account 접속 시에도 마이 탭 활성화)
        const isActive = currentPath.startsWith(tab.path);
        const iconSrc = isImmersiveVotePath ? tab.icon : isActive ? tab.activeIcon : tab.icon;

        return (
          <Link
            key={tab.key}
            to={tab.path}
            className={`flex flex-col items-center justify-center gap-1 text-label-s transition-colors ${
              isImmersiveVotePath ? "text-grey-divider" : "text-grey-black"
            }`}
          >
            <img
              src={iconSrc}
              alt={`${tab.label} 아이콘`}
              className="h-6 w-6"
              style={
                isImmersiveVotePath
                  ? {
                      filter:
                        "brightness(0) saturate(100%) invert(99%) sepia(2%) saturate(427%) hue-rotate(209deg) brightness(100%) contrast(96%)",
                    }
                  : undefined
              }
            />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
