import { useEffect, useState } from "react";

const SWIPE_HINT_IDLE_DELAY_MS = 10_000;
const ACTIVITY_EVENTS = ["pointerdown", "touchstart", "click", "keydown", "wheel", "scroll"] as const;

export function useSwipeNextVoteHint(isEnabled: boolean) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    if (!isEnabled) return;

    let timeoutId: number | undefined;

    const restartTimer = () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      setIsVisible(false);

      if (document.visibilityState !== "visible") return;
      timeoutId = window.setTimeout(() => setIsVisible(true), SWIPE_HINT_IDLE_DELAY_MS);
    };

    restartTimer();
    for (const eventName of ACTIVITY_EVENTS) {
      window.addEventListener(eventName, restartTimer, { passive: true });
    }
    document.addEventListener("visibilitychange", restartTimer);

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      for (const eventName of ACTIVITY_EVENTS) {
        window.removeEventListener(eventName, restartTimer);
      }
      document.removeEventListener("visibilitychange", restartTimer);
    };
  }, [isEnabled]);

  return isEnabled && isVisible;
}
