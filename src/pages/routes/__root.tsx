import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, useRouterState } from "@tanstack/react-router";
import { BottomTabBar } from "@/features/common/ui/BottomTabBar";

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

  // 하단 탭바가 노출되어야 하는 메인 페이지의 경로들을 배열로 정의합니다.
  const mainTabPaths = ['/home', '/immersive-votes', '/chat', '/mypage'];

  // 현재 접속한 주소가 메인 페이지 경로 중 하나로 시작하는지 확인합니다.
  const isShowBottomTab = mainTabPaths.some(path => currentPath.startsWith(path));

  return (
      <div className="relative max-w-md mx-auto min-h-dvh bg-white shadow-sm">
        <Outlet />

        {/* 조건이 참(true)일 때만 하단 탭바를 렌더링합니다. */}
        {isShowBottomTab && <BottomTabBar />}
      </div>
  );
}