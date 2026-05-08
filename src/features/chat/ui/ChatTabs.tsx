import type { ChatTabType } from "../model/types";

interface ChatTabsProps {
  activeTab: ChatTabType;
  onChangeTab: (tab: ChatTabType) => void;
}

const tabs: Array<{ key: ChatTabType; label: string }> = [
  { key: "active", label: "투표 진행 중" },
  { key: "ended", label: "투표 종료" },
];

export function ChatTabs({ activeTab, onChangeTab }: ChatTabsProps) {
  return (
    <div className="px-5 border-b border-grey-stroke">
      <div className="grid grid-cols-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChangeTab(tab.key)}
              className={`relative h-12 text-body-m ${isActive ? "text-grey-black" : "text-grey-light"}`}
            >
              {tab.label}
              {isActive && <span className="absolute bottom-0 left-0 h-[2px] w-full bg-grey-black" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
