import { API_BASE_URL } from "@base/api/client";
import { showToast } from "@base/ui/Toast";
import { Tooltip } from "@base/ui/Tooltip";
import { userQueryOptions } from "@features/auth/api/userQuery";
import { logout } from "@features/mypage/api/logout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

const OAUTH_BASE_URL = import.meta.env.VITE_OAUTH_BASE_URL ?? API_BASE_URL;
const GOOGLE_LOGIN_URL = `${OAUTH_BASE_URL}/oauth2/authorization/google`;
const USE_OAUTH_POPUP = import.meta.env.DEV;

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isPending: isUserPending } = useQuery(userQueryOptions());
  const [isBrowsingAsGuest, setIsBrowsingAsGuest] = useState(false);

  const browseAsGuest = async () => {
    try {
      setIsBrowsingAsGuest(true);
      const currentUser =
        user ??
        (isUserPending
          ? await queryClient.fetchQuery({ ...userQueryOptions(), staleTime: 0 }).catch(() => null)
          : null);

      if (currentUser) await logout();

      queryClient.clear();
      queryClient.setQueryData(["user", "me"], null);
      navigate({ to: "/home" });
    } catch {
      showToast.warning("비회원으로 전환하지 못했어요. 다시 시도해 주세요.");
    } finally {
      setIsBrowsingAsGuest(false);
    }
  };

  const loginWithGoogle = () => {
    if (!USE_OAUTH_POPUP) {
      window.location.href = GOOGLE_LOGIN_URL;
      return;
    }

    const popup = window.open(GOOGLE_LOGIN_URL, "google-login", "width=480,height=720");

    if (!popup) {
      showToast.warning("팝업 차단을 해제한 뒤 다시 시도해 주세요.");
      return;
    }

    queryClient.removeQueries({ queryKey: ["user", "me"] });

    const intervalId = window.setInterval(async () => {
      try {
        const user = await queryClient.fetchQuery({ ...userQueryOptions(), staleTime: 0 });

        if (user) {
          window.clearInterval(intervalId);
          popup.close();
          navigate({ to: "/home" });
        }
      } catch {
        // 로그인 완료 전에는 프로필 조회가 실패할 수 있습니다.
      }

      if (popup.closed) {
        window.clearInterval(intervalId);
      }
    }, 1000);
  };

  return (
    <main className="flex flex-col items-center justify-center px-5 bg-white min-h-dvh">
      <img src="/assets/images/logo_118x118.png" alt="" className="w-[56px] h-[56px]" />
      <h1 className="flex flex-col items-center mt-6">
        <span className="text-h-m">고민은 짧게, 재미는 길게</span>
        <span className="text-h-m font-normal">우리의 선택이 만나는 곳 VS</span>
      </h1>

      <div className="flex flex-col gap-2 w-full mt-[72px]">
        <button
          type="button"
          className="w-full text-grey-divider bg-primary text-body-m py-4 rounded-lg"
          onClick={loginWithGoogle}
        >
          Google로 시작하기
        </button>
        <Tooltip
          trigger={
            <button
              type="button"
              className="w-full text-grey-light bg-transparent border border-grey-stroke text-body-m py-4 rounded-lg"
              onClick={browseAsGuest}
              disabled={isBrowsingAsGuest || isUserPending}
            >
              {isBrowsingAsGuest || isUserPending ? "전환 중..." : "비회원으로 둘러보기"}
            </button>
          }
          offset={20}
        >
          <span className="text-label-m">비회원 투표 참여는 5회만 가능해요</span>
        </Tooltip>
      </div>
    </main>
  );
}
