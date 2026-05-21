import { Tooltip } from "@base/ui/Tooltip";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const browseAsGuest = () => {
    navigate({ to: "/home" });
  };

  return (
    <main className="flex flex-col items-center justify-center px-5 bg-white min-h-dvh">
      <img src="/assets/images/logo_118x118.png" alt="" className="w-[56px] h-[56px]" />
      <h1 className="flex flex-col items-center mt-6">
        <span className="text-h-m">고민은 짧게, 재미는 길게</span>
        <span className="text-h-m font-normal">우리의 선택이 만나는 곳 VS</span>
      </h1>

      <div className="flex flex-col gap-2 w-full mt-[72px]">
        <button type="button" className="w-full text-grey-divider bg-primary text-body-m py-4 rounded-lg">
          Google로 시작하기
        </button>
        <Tooltip
          trigger={
            <button
              type="button"
              className="w-full text-grey-light bg-transparent border border-grey-stroke text-body-m py-4 rounded-lg"
              onClick={browseAsGuest}
            >
              비회원으로 둘러보기
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
