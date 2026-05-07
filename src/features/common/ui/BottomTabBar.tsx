import { bottomTabs } from "@/features/home/data/mockHomeData";

interface BottomTabBarProps {
  activeTab?: "home" | "vote" | "chat" | "my";
  onClickTab?: (path: string) => void;
}

export function BottomTabBar({ activeTab = "home", onClickTab }: BottomTabBarProps) {
  return (
    <nav className="fixed bottom-0 z-20 grid w-full h-16 max-w-md grid-cols-4 pb-1 -translate-x-1/2 bg-white border-t left-1/2 border-grey-stroke">
      {bottomTabs.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onClickTab?.(tab.path)}
            className={`flex flex-col items-center justify-center gap-1 text-label-s ${
              isActive ? "text-grey-black" : "text-grey-light"
            }`}
          >
            <span className="leading-none text-title-m">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
