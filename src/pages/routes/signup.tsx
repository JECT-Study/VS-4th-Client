import { userQueryOptions } from "@features/auth/api/userQuery";
import { signupDefaultsQueryOptions } from "@features/signup/api/signupDefaultsQuery";
import { SignupPage } from "@features/signup/ui/SignupPage";
import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  loader: ({ context: { queryClient } }) => queryClient.prefetchQuery(signupDefaultsQueryOptions()),
  component: SignupPage,
});
