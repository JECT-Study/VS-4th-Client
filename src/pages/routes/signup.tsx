import { userQueryOptions } from "@features/auth/api/userQuery";
import { signupDefaultsQueryOptions } from "@features/signup/api/signupDefaultsQuery";
import { SignupPage } from "@features/signup/ui/SignupPage";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.fetchQuery(userQueryOptions());
    if (user) throw redirect({ to: "/home" });
  },
  loader: ({ context: { queryClient } }) => queryClient.prefetchQuery(signupDefaultsQueryOptions()),
  component: SignupPage,
});
