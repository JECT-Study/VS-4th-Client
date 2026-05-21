import { useEffect, useState } from "react";

interface DonutSegment {
  label: string;
  count: number;
  color: string;
}

interface GenderDonutChartProps {
  primary: DonutSegment;
  secondary: DonutSegment;
  size?: number;
  strokeWidth?: number;
  duration?: number;
}

function GenderDonutChart({ primary, secondary, size = 160, strokeWidth = 30, duration = 700 }: GenderDonutChartProps) {
  const total = primary.count + secondary.count;
  const primaryRatio = total === 0 ? 0 : primary.count / total;
  const primaryPercent = Math.round(primaryRatio * 100);
  const secondaryPercent = 100 - primaryPercent;

  const center = size / 2;
  const radius = (size - strokeWidth) / 2 - 2;
  const circumference = 2 * Math.PI * radius;

  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const primaryDashOffset = animated ? circumference * (1 - primaryRatio) : circumference;

  return (
    <div className="flex items-center gap-6">
      <div className="shrink-0">
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="성별 분포 도넛 차트">
          <title>성별 분포 도넛 차트</title>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={secondary.color}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            transform={`rotate(-90 ${center} ${center})`}
            style={{ strokeDasharray: circumference, strokeDashoffset: 0 }}
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={primary.color}
            strokeWidth={strokeWidth}
            transform={`rotate(45 ${center} ${center})`}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: primaryDashOffset,
              transition: animated ? `stroke-dashoffset ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)` : "none",
            }}
          />
          <text
            x={center}
            y={center - 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={16}
            fontWeight={400}
            fill="#434346"
          >
            전체
          </text>
          <text
            x={center}
            y={center + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={16}
            fontWeight={400}
            fill="#434346"
          >
            {total}명
          </text>
        </svg>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: primary.color }} />
            <span className="text-label-m text-grey-dark">{primary.label}</span>
          </span>
          <span className="text-label-m text-grey-dark">
            {primaryPercent}% ({primary.count}명)
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: secondary.color }} />
            <span className="text-label-m text-grey-purple">{secondary.label}</span>
          </span>
          <span className="text-label-m text-grey-purple">
            {secondaryPercent}% ({secondary.count}명)
          </span>
        </div>
      </div>
    </div>
  );
}

export { GenderDonutChart };
