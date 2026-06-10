import clsx from "clsx";
import { useEffect, useState } from "react";

export function VoteBar({ ratio, isLeading, isEnded }: { ratio: number; isLeading: boolean; isEnded: boolean }) {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setAnimatedWidth(ratio), 0);
    return () => clearTimeout(id);
  }, [ratio]);

  return (
    <span
      className={clsx(
        "absolute inset-y-0 left-0 rounded-lg transition-[width] duration-700 ease-out",
        isLeading ? (isEnded ? "bg-grey-disabled" : "bg-primary-300") : isEnded ? "bg-grey-stroke" : "bg-primary-100",
      )}
      style={{ width: `${animatedWidth}%` }}
    />
  );
}
