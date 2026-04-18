import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: () => null,
});

function RootComponent() {
  return (
    <div className="min-h-dvh max-w-md mx-auto">
      <Outlet />
    </div>
  );
}
