import { userQueryOptions } from "@features/auth/api/userQuery";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: async ({ context: { queryClient } }) => {
    const user = await queryClient.fetchQuery(userQueryOptions());
    throw redirect({ to: user ? "/immersive-votes" : "/login" });
  },
});
