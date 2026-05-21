import { useEffect, useState } from "react";

export function VoteBar({ ratio, isSelected }: { ratio: number; isSelected: boolean }) {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setAnimatedWidth(ratio), 0);
    return () => clearTimeout(id);
  }, [ratio]);

  return (
    <span
      className={`absolute inset-y-0 left-0 rounded-lg transition-[width] duration-700 ease-out ${isSelected ? "bg-primary" : "bg-grey-disabled"}`}
      style={{ width: `${animatedWidth}%` }}
    />
  );
}
