import { type RefObject, useEffect } from "react";
import { IMPRESSION_DWELL_MS, IMPRESSION_VISIBLE_RATIO } from "../config/constants";
import { beginImmersiveExposure, confirmImmersiveImpression, endImmersiveExposure } from "./immersiveImpression";

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
        dwellTimer = window.setTimeout(() => {
          dwellTimer = null;
          confirmImmersiveImpression(voteId);
        }, IMPRESSION_DWELL_MS);
      },
      { threshold: IMPRESSION_VISIBLE_RATIO },
    );

    observer.observe(element);
    return () => {
      clearDwellTimer();
      observer.disconnect();
      if (isVisible) endImmersiveExposure(voteId);
    };
  }, [targetRef, voteId, position]);
}
