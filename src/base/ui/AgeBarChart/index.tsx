import { useEffect, useState } from "react";

interface AgeGroupItem {
  label: string;
  percentage: number;
  isPrimary?: boolean;
  isMyGroup?: boolean;
}

interface AgeBarChartProps {
  groups: AgeGroupItem[];
  duration?: number;
}

function AgeBarChart({ groups, duration = 700 }: AgeBarChartProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => (
        <AgeBarGroup key={group.label} group={group} animated={animated} duration={duration} />
      ))}
    </div>
  );
}

interface AgeBarGroupProps {
  group: AgeGroupItem;
  animated: boolean;
  duration: number;
}

function AgeBarGroup({ group, animated, duration }: AgeBarGroupProps) {
  const { label, percentage, isPrimary = false, isMyGroup = false } = group;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`${isMyGroup ? "text-primary text-body-m" : "text-grey-dark text-label-m"}`}>{label}</span>
          {isMyGroup && <span className="bg-primary text-white text-label-s px-[6px] py-1 rounded-full">내 그룹</span>}
        </div>
        <span className={`${isMyGroup ? "text-primary text-body-m" : "text-grey-dark text-label-m"}`}>
          {percentage}%
        </span>
      </div>

      <div className="w-full bg-grey-stroke rounded-full h-5 overflow-hidden">
        <div
          className={`h-full rounded-full ${isPrimary ? "bg-primary-light" : "bg-grey-purple"}`}
          style={{
            width: animated ? `${percentage}%` : "0%",
            transition: `width ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        />
      </div>
    </div>
  );
}

export { AgeBarChart };
