import { BottomTabBar } from "@/features/common/ui/BottomTabBar";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, useRouterState } from "@tanstack/react-router";

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: () => <div className="p-4">페이지를 찾을 수 없습니다.</div>,
});

function RootComponent() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // 1. 탭바가 노출되어야 하는 '정확한' 최상위 경로만 정의합니다. (홈, VOTE, 채팅, 마이페이지 메인)
  // 프로젝트 설정에 따라 홈 경로가 '/' 일 수도, '/home' 일 수도 있으니 둘 다 넣거나 맞는 것만 남깁니다.
  const mainTabPaths = ["/", "/home", "/immersive-votes", "/chat", "/mypage"];

  // 2. startsWith가 아닌 '정확히 일치(includes)'할 때만 탭바를 렌더링합니다.
  const isShowBottomTab = mainTabPaths.includes(currentPath);

  return (
    <div className="relative max-w-md mx-auto min-h-dvh bg-white shadow-sm">
      <Outlet />
      {isShowBottomTab && <BottomTabBar />}
    </div>
  );
}
