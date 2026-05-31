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

const iconClassName = "h-[clamp(22px,6svh,28px)] w-[clamp(22px,6svh,28px)] text-grey-light";

function LockIcon() {
  return (
    <svg
      className="h-[clamp(40px,7svh,56px)] w-[clamp(40px,7svh,56px)]"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 29V21C20 14.373 25.373 9 32 9C38.627 9 44 14.373 44 21V29"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect x="14" y="29" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="4" />
      <path d="M32 39V45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function VoteIcon() {
  return (
    <svg className={iconClassName} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M7.5 19.5H22.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M10.5 16.5L16.7 10.3C17.2 9.8 18 9.8 18.5 10.3L23.2 15C23.7 15.5 23.7 16.3 23.2 16.8L20.5 19.5H7.5L10.5 16.5Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M13.8 15.5L12.2 17.1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M7.5 19.5L5 22.5H25"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className={iconClassName} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M6 7.5H22C23.105 7.5 24 8.395 24 9.5V18C24 19.105 23.105 20 22 20H14L8 24V20H6C4.895 20 4 19.105 4 18V9.5C4 8.395 4.895 7.5 6 7.5Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M9 12.5H19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M9 16H15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function SegmentIcon() {
  return (
    <svg className={iconClassName} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 4V14H24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M22.3 18.5C20.6 21.8 17.3 24 13.5 24C8.253 24 4 19.747 4 14.5C4 9.7 7.56 5.735 12.18 5.095"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M18 5.3C20.3 6.3 22.2 8.2 23.1 10.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function NotificationIcon() {
  return (
    <svg className={iconClassName} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M7.5 20H20.5L19 17.5V12.5C19 9.739 16.761 7.5 14 7.5C11.239 7.5 9 9.739 9 12.5V17.5L7.5 20Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M12 22C12.4 23.2 13 23.8 14 23.8C15 23.8 15.6 23.2 16 22"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M14 4.5V6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function BenefitIcon({ icon }: { icon: BenefitItem["icon"] }) {
  const icons = {
    vote: <VoteIcon />,
    chat: <ChatIcon />,
    segment: <SegmentIcon />,
    notification: <NotificationIcon />,
  };

  return (
    <div className="flex h-[clamp(44px,6.6svh,56px)] w-[clamp(44px,6.6svh,56px)] shrink-0 items-center justify-center rounded-[14px] bg-grey-divider">
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
    <main className="fixed inset-0 z-30 mx-auto flex min-h-dvh max-w-md flex-col overflow-hidden bg-white px-8 pb-[calc(env(safe-area-inset-bottom)+80px)] pt-[calc(env(safe-area-inset-top)+clamp(40px,7svh,72px))]">
      <button
        type="button"
        onClick={() => navigate({ to: "/home" })}
        className="absolute right-8 top-[calc(env(safe-area-inset-top)+clamp(16px,3svh,32px))] flex h-11 w-11 items-center justify-center text-grey-black"
        aria-label="닫기"
      >
        <svg className="h-9 w-9" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M8 8L28 28M28 8L8 28" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>

      <section className="flex flex-col items-center text-center text-grey-black">
        <LockIcon />

        <h1 className="mt-[clamp(14px,2.5svh,28px)] text-[clamp(20px,3.4svh,24px)] font-semibold leading-[1.3]">
          채팅은 회원 전용 기능이에요
        </h1>

        <p className="mt-[clamp(10px,2svh,24px)] whitespace-pre-line text-[clamp(16px,2.8svh,22px)] font-normal leading-[1.35] text-grey-dark">
          로그인 한 번으로{"\n"}이 모든 걸 제한 없이 누려보세요
        </p>
      </section>

      <section className="mt-[clamp(24px,4.5svh,64px)] space-y-[clamp(10px,2svh,24px)]">
        {benefitItems.map((item) => (
          <div key={item.title} className="flex items-center gap-[clamp(14px,4vw,20px)]">
            <BenefitIcon icon={item.icon} />

            <div>
              <strong className="text-[clamp(15px,2.5svh,18px)] font-semibold leading-[1.3] text-grey-black">
                {item.title}
              </strong>
              <p className="mt-1 text-[clamp(13px,2.2svh,16px)] leading-[1.35] text-grey-light">{item.description}</p>
            </div>
          </div>
        ))}
      </section>

      <button
        type="button"
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+clamp(16px,3svh,40px))] left-1/2 h-[clamp(48px,7svh,56px)] w-[calc(100%-64px)] max-w-[326px] -translate-x-1/2 rounded-lg bg-primary text-body-m text-white"
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
