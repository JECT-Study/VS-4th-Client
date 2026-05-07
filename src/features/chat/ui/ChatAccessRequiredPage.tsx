import { useNavigate } from "@tanstack/react-router";

const benefitItems = [
  {
    title: "무제한 VS 투표 참여",
    description: "제한 없이 모든 투표에 참여해요",
    icon: "△",
  },
  {
    title: "실시간 채팅",
    description: "투표 후 다른 사람들과 의견을 나눠봐요",
    icon: "○",
  },
  {
    title: "세그먼트 결과",
    description: "성별/연령대 상세 결과를 확인해 보세요",
    icon: "◔",
  },
  {
    title: "결과 공개 알림",
    description: "투표가 마감되면 결과를 가장 먼저 받아봐요",
    icon: "♧",
  },
];

export function ChatAccessRequiredPage() {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen px-8 pt-20 pb-10 bg-white">
      <button
        type="button"
        onClick={() => navigate({ to: "/home" })}
        className="absolute right-8 top-24 text-h-m text-grey-black"
        aria-label="닫기"
      >
        ×
      </button>

      <section className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center w-12 h-12 mb-5 border-2 rounded-xl border-grey-black text-title-m">
          🔒
        </div>

        <h1 className="text-title-m text-grey-black">채팅은 회원 전용 기능이에요</h1>

        <p className="mt-5 whitespace-pre-line text-body-s text-grey-dark">
          로그인 한 번으로{"\n"}이 모든 걸 제한 없이 누려보세요
        </p>
      </section>

      <section className="mt-12 space-y-5">
        {benefitItems.map((item) => (
          <div key={item.title} className="flex items-center gap-4">
            <div className="flex items-center justify-center h-11 w-11 shrink-0 rounded-xl bg-grey-divider text-grey-light">
              {item.icon}
            </div>

            <div>
              <strong className="text-body-m text-grey-black">{item.title}</strong>
              <p className="mt-1 text-label-m text-grey-light">{item.description}</p>
            </div>
          </div>
        ))}
      </section>

      <button
        type="button"
        className="fixed bottom-10 left-1/2 h-14 w-[calc(100%-64px)] max-w-[360px] -translate-x-1/2 rounded-lg bg-primary text-body-m text-white"
      >
        Google로 시작하기
      </button>
    </main>
  );
}
