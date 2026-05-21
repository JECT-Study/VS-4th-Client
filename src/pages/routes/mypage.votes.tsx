import { ActiveParticipatedVoteList } from "@features/mypage/ui/ActiveParticipatedVoteList";
import { ClosedParticipatedVoteList } from "@features/mypage/ui/ClosedParticipatedVoteList";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/mypage/votes")({
  component: RouteComponent,
});

const tabs: Array<{ key: "active" | "ended"; label: string }> = [
  { key: "active", label: "진행 중" },
  { key: "ended", label: "종료" },
];

function RouteComponent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"active" | "ended">("active");

  return (
    <div className="h-dvh flex flex-col">
      <header className="py-[6px] pl-1 pr-5">
        <div className="flex items-center gap-[2px]">
          <button type="button" className="p-[10px] text-grey-dark" onClick={() => navigate({ to: "/mypage" })}>
            <img src="/assets/icons/arrow-left.svg" alt="뒤로가기" />
          </button>

          <h1 className="text-title-m">내가 참여한 투표</h1>
        </div>
      </header>

      <div className="pt-4 px-5 flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-grey-stroke">
          <div className="grid grid-cols-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative h-12 text-body-m ${isActive ? "text-grey-black" : "text-grey-light"}`}
                >
                  {tab.label}
                  {isActive && <span className="absolute bottom-0 left-0 h-[2px] w-full bg-grey-black" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="py-3 flex-1 overflow-hidden">
          {activeTab === "active" && <ActiveParticipatedVoteList />}
          {activeTab === "ended" && <ClosedParticipatedVoteList />}
        </div>
      </div>
    </div>
  );
}
