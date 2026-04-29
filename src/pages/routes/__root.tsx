import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: () => <div className="p-4">페이지를 찾을 수 없습니다.</div>,
});

function RootComponent() {
  return (
    <div className="max-w-md mx-auto min-h-dvh">
      <Outlet />
    </div>
  );
}
