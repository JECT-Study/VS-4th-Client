import type { User } from "@features/auth/model/types";
import { PROFILE_COLOR } from "@features/signup/config/profileColors";
import { Link } from "@tanstack/react-router";
// features 계층에서 알림 설정 토글 컴포넌트를 불러옵니다.
import { NotificationSettingToggle } from "@features/notification/ui/NotificationSettingToggle";

interface MemberMyPageProps {
  user: User;
}

export function MemberMyPage({ user }: MemberMyPageProps) {
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

          <button type="button" className="text-body-s text-grey-light">
            로그아웃
          </button>
        </div>
      </div>
  );
}