import { useEffect, useState } from "react";

const formatRemainingTime = (endAt: string) => {
  const diff = Math.max(0, new Date(endAt).getTime() - Date.now());
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return [hours, minutes, seconds].map((unit) => String(unit).padStart(2, "0")).join(":");
};

export function ImmersiveVoteTimer({ endAt }: { endAt: string }) {
  const [remainingTime, setRemainingTime] = useState(() => formatRemainingTime(endAt));

  useEffect(() => {
    setRemainingTime(formatRemainingTime(endAt));
    const timer = window.setInterval(() => setRemainingTime(formatRemainingTime(endAt)), 1000);
    return () => window.clearInterval(timer);
  }, [endAt]);

  return <div className="px-5 text-label-m text-primary-light">투표 종료까지 {remainingTime}</div>;
}
