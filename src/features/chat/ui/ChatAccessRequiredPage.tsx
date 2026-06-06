import { Spinner } from "@base/ui/Spinner";
import { userQueryOptions } from "@features/auth/api/userQuery";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

type BenefitItem = {
  title: string;
  description: string;
  icon: "vote" | "chat" | "segment" | "notification";
};

const benefitItems: BenefitItem[] = [
  {
    title: "무제한 VS 투표 참여",
    description: "제한 없이 모든 투표에 참여해요",
    icon: "vote",
  },
  {
    title: "실시간 채팅",
    description: "투표 후 다른 사람들과 의견을 나눠봐요",
    icon: "chat",
  },
  {
    title: "세그먼트 결과",
    description: "성별/연령대 상세 결과를 확인해 보세요",
    icon: "segment",
  },
  {
    title: "결과 공개 알림",
    description: "투표가 마감되면 결과를 가장 먼저 받아봐요",
    icon: "notification",
  },
];

function BenefitIcon({ icon }: { icon: BenefitItem["icon"] }) {
  const icons = {
    vote: <img src="/assets/icons/login-vote.svg" alt="" />,
    chat: <img src="/assets/icons/login-chat.svg" alt="" />,
    segment: <img src="/assets/icons/segment.svg" alt="" />,
    notification: <img src="/assets/icons/login-bell.svg" alt="" />,
  };

  return (
    <div className="flex items-center justify-center w-[42px] h-[42px] rounded-[10px] bg-grey-divider">
      {icons[icon]}
    </div>
  );
}

export function ChatAccessRequiredPage() {
  const navigate = useNavigate();

  const loginWithGoogle = () => {
    window.location.href = "https://api.vs.io.kr/oauth2/authorization/google";
  };

  return (
    <main className="fixed inset-0 z-30 mx-auto flex min-h-dvh max-w-md flex-col items-center bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-[calc(env(safe-area-inset-top)+16px)]">
      <div className="flex items-center justify-end p-4 w-full">
        <button type="button" onClick={() => navigate({ to: "/home" })} className="w-6 h-6" aria-label="닫기">
          <img src="/assets/icons/close.svg" alt="" />
        </button>
      </div>

      <div className="overflow-auto">
        <section className="flex flex-col items-center text-center text-grey-black mt-4">
          <img src="/assets/icons/lock.svg" alt="" className="shrink-0" />

          <h1 className="mt-3 text-h-s">채팅은 회원 전용 기능이에요</h1>

          <p className="mt-4 whitespace-pre-line text-title-s text-grey-dark">
            로그인 한 번으로{"\n"}이 모든 걸 제한 없이 누려보세요
          </p>
        </section>

        <section className="mt-12 space-y-6">
          {benefitItems.map((item) => (
            <div key={item.title} className="flex items-center gap-[clamp(14px,4vw,20px)]">
              <BenefitIcon icon={item.icon} />

              <div>
                <strong className="text-body-m text-grey-black">{item.title}</strong>
                <p className="mt-[2px] text-label-m text-grey-light">{item.description}</p>
              </div>
            </div>
          ))}
        </section>
      </div>

      <button
        type="button"
        className="h-14 w-full rounded-lg bg-primary text-body-m text-white shrink-0 mt-24"
        onClick={loginWithGoogle}
      >
        Google로 시작하기
      </button>
    </main>
  );
}

export function ChatAccessGate({ children }: { children: ReactNode }) {
  const { data: user, isPending } = useQuery(userQueryOptions());

  if (isPending) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-white">
        <Spinner />
      </main>
    );
  }

  if (!user) return <ChatAccessRequiredPage />;

  return children;
}
