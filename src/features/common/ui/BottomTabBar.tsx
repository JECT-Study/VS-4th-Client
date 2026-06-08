import { bottomTabs } from "@features/common/config/bottomTabs.ts";
import { Link, useRouterState } from "@tanstack/react-router";

export function BottomTabBar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const isImmersiveVotePath = currentPath.startsWith("/immersive-votes");

  // 1. 여기서 사용하지 않는 isActive 매개변수를 아예 삭제합니다.
  const getIconClassName = (key: string) => {
    if (key === "home") return "h-5 w-5";
    return "h-6 w-6";
  };

  return (
    <nav
      style={{ viewTransitionName: "bottom-tab-bar" }}
      className={`fixed bottom-0 z-20 grid h-16 w-full max-w-md -translate-x-1/2 grid-cols-4 border-t pb-1 left-1/2 ${
        isImmersiveVotePath ? "border-grey-black bg-grey-black" : "border-grey-stroke bg-white"
      }`}
    >
      {bottomTabs.map((tab) => {
        const isActive = currentPath.startsWith(tab.path);

        // 1. 활성화 상태면 무조건 activeIcon, 아니면 기본 icon 렌더링
        const iconSrc = isActive ? tab.activeIcon : tab.icon;

        // 2. 몰입형 화면이면서 '비활성화된 탭'에만 필터 적용 (활성화된 탭은 원본 색상 유지)
        const shouldApplyFilter = isImmersiveVotePath && !isActive;

        return (
          <Link
            key={tab.key}
            to={tab.path}
            aria-current={isActive ? "page" : undefined}
            onClick={(event) => {
              if (isActive) event.preventDefault();
            }}
            className={`grid h-full grid-rows-[28px_16px] place-items-center content-center gap-1 text-label-s transition-colors ${
              isImmersiveVotePath
                ? isActive
                  ? "text-white"
                  : "text-grey-divider" // 몰입형 뷰에서 활성화된 텍스트 색상 조정 (필요시 변경)
                : "text-grey-black"
            }`}
          >
            <span className="flex items-center justify-center h-7 w-7">
              <img
                src={iconSrc}
                alt={`${tab.label} 아이콘`}
                className={`${getIconClassName(tab.key)} flex-shrink-0`}
                style={
                  shouldApplyFilter
                    ? {
                        filter:
                          "brightness(0) saturate(100%) invert(99%) sepia(2%) saturate(427%) hue-rotate(209deg) brightness(100%) contrast(96%)",
                      }
                    : undefined
                }
              />
            </span>
            <span className="leading-4">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
