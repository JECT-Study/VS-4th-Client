import type { User } from "@features/auth/model/types";
import { logout } from "@features/mypage/api/logout";
import { PROFILE_COLOR } from "@features/signup/config/profileColors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { NotificationSettingToggle } from "@features/notification/ui/NotificationSettingToggle";
import { showToast } from "@base/ui/Toast";

interface MemberMyPageProps {
  user: User;
}

export function MemberMyPage({ user }: MemberMyPageProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ refetchType: "all" });
      showToast.success("로그아웃 되었어요.");
      navigate({ to: "/home" });
    },
    onError: () => {
      showToast.warning("일시적인 오류로 로그아웃하지 못했어요.");
    },
  });

  return (
    <div className="py-4 px-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={PROFILE_COLOR[user.imageColor as keyof typeof PROFILE_COLOR]} alt="" className="w-12 h-12" />
          <div className="flex flex-col gap-1">
            <span className="text-label-m">닉네임</span>
            <span className="text-title-s">{user.nickname}</span>
          </div>
        </div>

        <Link to="/mypage/profile">
          <img src="/assets/icons/arrow-right-s.svg" alt="프로필 편집" />
        </Link>
      </div>

      <hr className="w-full h-px bg-grey-divider my-8" />

      <div className="flex flex-col gap-8 items-start">
        <div className="flex items-center justify-between w-full">
          <span className="text-title-s">내가 참여한 투표</span>
          <Link to="/mypage/votes">
            <img src="/assets/icons/arrow-right-s.svg" alt="내가 참여한 투표" />
          </Link>
        </div>

        <div className="flex items-center justify-between w-full">
          <span className="text-title-s">계정</span>
          <Link to="/mypage/account">
            <img src="/assets/icons/arrow-right-s.svg" alt="계정" />
          </Link>
        </div>

        <div className="flex items-center justify-between w-full">
          <span className="text-title-s">투표 결과 푸시 알림</span>
          {/* 👇 기존 Switch 주석 자리에 모달 로직이 포함된 토글 컴포넌트 부착 */}
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
