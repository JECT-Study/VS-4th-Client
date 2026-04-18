import { createRouter } from "@tanstack/react-router";
import { queryClient } from "./queryClient";
import { routeTree } from "./routeTree.gen";

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultPreloadStaleTime: 1000 * 60 * 5,
  defaultViewTransition: {
    types: ({ fromLocation, toLocation }) => {
      if (!fromLocation) return ["forward"];

      const fromIndex = fromLocation.state.__TSR_index ?? 0;
      const toIndex = toLocation.state.__TSR_index ?? 0;

      return [fromIndex > toIndex ? "back" : "forward"];
    },
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
