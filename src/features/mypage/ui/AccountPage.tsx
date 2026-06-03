import { Spinner } from "@base/ui/Spinner";
import { userQueryOptions } from "@features/auth/api/userQuery";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";

export function AccountPage() {
  const navigate = useNavigate();
  const { data: user, isLoading: isUserLoading } = useQuery(userQueryOptions());

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div>
        <header className="py-[6px] pl-1 pr-5">
          <div className="flex items-center gap-[2px]">
            <button
              type="button"
              className="p-[10px] text-grey-dark"
              onClick={() => {
                navigate({ to: "/mypage" });
              }}
            >
              <img src="/assets/icons/arrow-left.svg" alt="뒤로가기" />
            </button>

            <h1 className="text-title-m">계정</h1>
          </div>
        </header>

        {isUserLoading ? (
          <div className="flex items-center justify-center pt-48">
            <Spinner />
          </div>
        ) : (
          <div className="mt-4 px-5">
            <div className="flex flex-col gap-[2px]">
              <span className="text-label-m">성별</span>
              <span className="text-title-s">{user?.gender === "MALE" ? "남성" : "여성"}</span>
            </div>

            <hr className="w-full h-px bg-grey-[#f7f6f9] my-4" />

            <div className="flex flex-col gap-[2px]">
              <span className="text-label-m">출생 연도</span>
              <span className="text-title-s">{user?.birthDate}</span>
            </div>

            <hr className="w-full h-px bg-grey-[#f7f6f9] my-4" />

            <div className="flex flex-col gap-[2px]">
              <span className="text-label-m">이메일</span>
              <span className="text-title-s">{user?.email}</span>
            </div>

            <hr className="w-full h-px bg-grey-[#f7f6f9] my-4" />

            <div className="flex flex-col gap-[2px]">
              <span className="text-label-m">소셜 연동</span>
              <span className="text-title-s">Google 연동됨</span>
            </div>

            <hr className="w-full h-px bg-grey-[#f7f6f9] my-4" />

            <Link to="/mypage/withdrawal" className="text-body-s text-grey-light">
              회원 탈퇴
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
