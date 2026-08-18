import { type RefObject, useEffect } from "react";
import { IMPRESSION_DWELL_MS, IMPRESSION_VISIBLE_RATIO } from "../config/constants";
import {
  beginImmersiveExposure,
  confirmImmersiveImpression,
  endImmersiveExposure,
  restartImmersiveExposure,
} from "./immersiveImpression";

/**
 * 카드가 뷰포트에 50% 이상 보이는 구간을 노출로 관측한다.
 * 시간 측정은 보이기 시작한 순간부터 시작하고, 노출 이벤트는 1초를 채워야 나간다.
 * A안·B안 모두 카드 전체를 관측 대상으로 삼아 동일 기준을 적용하고,
 * 빠르게 스와이프해 지나간 카드는 대기 타이머가 취소돼 기록되지 않는다.
 */
export function useImmersiveImpression(targetRef: RefObject<HTMLElement | null>, voteId: number, position: number) {
  useEffect(() => {
    const element = targetRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    let dwellTimer: number | null = null;
    let isVisible = false;

    const clearDwellTimer = () => {
      if (dwellTimer === null) return;
      window.clearTimeout(dwellTimer);
      dwellTimer = null;
    };

    // 노출 기준이 "1초 연속"이라 중간에 끊기면 처음부터 다시 잰다.
    const restartDwellTimer = () => {
      clearDwellTimer();
      dwellTimer = window.setTimeout(() => {
        dwellTimer = null;
        confirmImmersiveImpression(voteId);
      }, IMPRESSION_DWELL_MS);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        const nextVisible = entry.intersectionRatio >= IMPRESSION_VISIBLE_RATIO;
        if (nextVisible === isVisible) return;
        isVisible = nextVisible;

        if (!nextVisible) {
          clearDwellTimer();
          endImmersiveExposure(voteId);
          return;
        }

        beginImmersiveExposure(voteId, position);
        restartDwellTimer();
      },
      { threshold: IMPRESSION_VISIBLE_RATIO },
    );

    // 탭이 내려가 있는 동안은 보고 있는 게 아니다.
    // 타이머를 그대로 두면 백그라운드에서 밀려 실행돼 노출이 영영 확정되지 않는다.
    const handleVisibilityChange = () => {
      if (!isVisible) return;
      if (document.visibilityState === "hidden") clearDwellTimer();
      else restartDwellTimer();
    };

    // BFCache 복원은 heap을 그대로 되살리므로 이탈로 마감된 노출이 남아 있다.
    // 그 상태를 두면 복귀 후의 행동이 전부 유실돼, 새 노출로 다시 연다.
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted || !isVisible) return;
      restartImmersiveExposure(voteId, position);
      restartDwellTimer();
    };

    observer.observe(element);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      clearDwellTimer();
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pageshow", handlePageShow);
      if (isVisible) endImmersiveExposure(voteId);
    };
  }, [targetRef, voteId, position]);
}
