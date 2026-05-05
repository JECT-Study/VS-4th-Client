import dayjs from "dayjs";
import { useEffect, useState } from "react";

export function VoteTimeRemaining({ endAt }: { endAt: string }) {
  const [remainingMs, setRemainingMs] = useState(() => dayjs(endAt).diff(dayjs()));

  useEffect(() => {
    const id = setInterval(() => {
      const next = dayjs(endAt).diff(dayjs());
      setRemainingMs(next);
      if (next <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [endAt]);

  if (remainingMs <= 0) return <span className="text-label-s">투표 종료</span>;

  const total = Math.floor(remainingMs / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  return <span className="text-label-s">{`${pad(h)}:${pad(m)}:${pad(s)} 남음`}</span>;
}
