import { showToast } from "@base/ui/Toast";
import type { User } from "@features/auth/model/types";
import { logout } from "@features/mypage/api/logout";
import { NotificationSettingToggle } from "@features/notification/ui/NotificationSettingToggle";
import { PROFILE_COLOR } from "@features/signup/config/profileColors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";

interface MemberMyPageProps {
  user: User;
}

export function MemberMyPage({ user }: MemberMyPageProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData(["user", "me"], null);
      showToast.success("로그아웃 되었어요.");
      navigate({ to: "/home" });
    },
    onError: () => {
      showToast.warning("일시적인 오류로 로그아웃하지 못했어요.");
    },
  });

  return (
    <div className="py-4 px-5">
      <Link to="/mypage/profile" className="flex items-center justify-between border-b border-grey-divider pb-8 mb-8">
        <div className="flex items-center gap-4">
          <img src={PROFILE_COLOR[user.imageColor as keyof typeof PROFILE_COLOR]} alt="" className="w-12 h-12" />
          <div className="flex flex-col gap-1">
            <span className="text-label-m">닉네임</span>
            <span className="text-title-s">{user.nickname}</span>
          </div>
        </div>

        <img src="/assets/icons/arrow-right-s.svg" alt="프로필 편집" />
      </Link>

      <div className="flex flex-col gap-8 items-start">
        <Link to="/mypage/votes" className="flex items-center justify-between w-full">
          <span className="text-title-s">내가 참여한 투표</span>
          <img src="/assets/icons/arrow-right-s.svg" alt="내가 참여한 투표" />
        </Link>

        <Link to="/mypage/account" className="flex items-center justify-between w-full">
          <span className="text-title-s">계정</span>
          <img src="/assets/icons/arrow-right-s.svg" alt="계정" />
        </Link>

        <div className="flex items-center justify-between w-full">
          <span className="text-title-s">투표 결과 푸시 알림</span>
          <NotificationSettingToggle />
        </div>

        <button
          type="button"
          className="text-body-s text-grey-light"
          disabled={logoutMutation.isPending}
          onClick={() => logoutMutation.mutate()}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
