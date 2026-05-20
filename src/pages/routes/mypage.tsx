import { Spinner } from "@base/ui/Spinner";
import { userQueryOptions } from "@features/auth/api/userQuery";
import { GuestMyPage } from "@features/mypage/ui/GuestMyPage";
import { MemberMyPage } from "@features/mypage/ui/MemberMyPage";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mypage")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user, isPending } = useQuery(userQueryOptions());

  return (
    <div>
      <header className="px-5 py-4">
        <h1 className="text-title-m">마이페이지</h1>
      </header>

      {isPending ? <Spinner /> : user ? <MemberMyPage user={user} /> : <GuestMyPage />}
    </div>
  );
}
