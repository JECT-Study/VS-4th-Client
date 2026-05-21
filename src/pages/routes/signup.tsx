import { userQueryOptions } from "@features/auth/api/userQuery";
import { signupDefaultsQueryOptions } from "@features/signup/api/signupDefaultsQuery";
import { SignupPage } from "@features/signup/ui/SignupPage";
import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  beforeLoad: async ({ context: { queryClient } }) => {
    let user: Awaited<ReturnType<typeof userQueryOptions>>["queryFn"] | null = null;
    try {
      user = (await queryClient.fetchQuery(userQueryOptions())) as typeof user;
    } catch (err) {
      if (isRedirect(err)) throw err;
      return;
    }
    if (user) throw redirect({ to: "/home" });
  },
  loader: ({ context: { queryClient } }) => queryClient.prefetchQuery(signupDefaultsQueryOptions()),
  component: SignupPage,
});
