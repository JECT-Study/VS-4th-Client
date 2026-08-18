import { v4 as uuid } from "uuid";
import {
  type ImmersiveFirstAction,
  postImmersiveFirstAction,
  postImmersiveImpression,
} from "../api/immersiveVoteTracking";
import { IMPRESSION_RESUME_GRACE_MS } from "../config/constants";

interface ImpressionState {
  impressionId: string;
  position: number;
  /**
   * 카드가 노출 기준(뷰포트 50%)을 넘어선 시각. performance.now() 기준.
   * 노출 판정에 필요한 1초를 채운 시점이 아니라 "보이기 시작한" 시점이라
   * elapsedMs가 기획서의 정의(콘텐츠 노출 → 행동)와 그대로 맞는다.
   */
  shownAt: number;
  /** 노출 시작 시점의 누적 백그라운드 시간. 체감 시간 계산에서 차감할 기준값. */
  backgroundMsAtStart: number;
  /** 화면에 보이는 카드 수. 캐러셀 되감기 순간에는 같은 투표의 두 벌이 잠시 겹친다. */
  visibleCount: number;
  /** 마지막으로 화면에서 사라진 시각. 아직 보이는 중이면 null. */
  hiddenAt: number | null;
  impressionSent: boolean;
  firstActionSent: boolean;
  /** participate에 노출 정보를 이미 실어 보냈는지. 취소·재투표에는 다시 싣지 않는다. */
  participateSent: boolean;
}

/**
 * 노출 상태를 voteId별로 보관한다.
 * 카드 UI(투표·이모지·공유·펼치기)와 피드 스와이프 로직(이탈)이
 * 같은 노출의 impressionId를 공유해야 해서 컴포넌트 밖 모듈 단위로 둔다.
 */
const impressions = new Map<number, ImpressionState>();

// 탭이 백그라운드에 있던 시간은 "콘텐츠를 보고 있던 시간"이 아니라서 elapsedMs에서 뺀다.
// 앱을 전환했다 몇 분 뒤 돌아와 투표한 사용자가 Time to Vote 평균을 망치는 걸 막는다.
let backgroundMsTotal = 0;
let backgroundedAt: number | null = null;

const backgroundMsNow = () => backgroundMsTotal + (backgroundedAt === null ? 0 : performance.now() - backgroundedAt);

const elapsedMsOf = (state: ImpressionState) => {
  const wallMs = performance.now() - state.shownAt;
  const awayMs = backgroundMsNow() - state.backgroundMsAtStart;
  return Math.max(0, Math.round(wallMs - awayMs));
};

/** 노출 이벤트를 아직 안 보냈으면 지금 보낸다. */
const flushImpression = (voteId: number, state: ImpressionState): void => {
  if (state.impressionSent) return;
  state.impressionSent = true;
  postImmersiveImpression(voteId, { impressionId: state.impressionId, position: state.position });
};

/**
 * 카드가 뷰포트 50%를 넘어섰을 때 호출한다. 이 시점부터 시간을 재고 impressionId를 발급하되,
 * 노출 이벤트 자체는 1초를 채우거나(confirm) 사용자가 먼저 행동했을 때 나간다.
 */
export const beginImmersiveExposure = (voteId: number, position: number): void => {
  const current = impressions.get(voteId);

  // 아직 보이는 중이거나 방금 잠깐 끊겼을 뿐이면 같은 노출로 이어 붙인다.
  if (
    current &&
    (current.visibleCount > 0 || performance.now() - (current.hiddenAt ?? 0) <= IMPRESSION_RESUME_GRACE_MS)
  ) {
    current.visibleCount += 1;
    current.hiddenAt = null;
    return;
  }

  impressions.set(voteId, {
    impressionId: uuid(),
    position,
    shownAt: performance.now(),
    backgroundMsAtStart: backgroundMsNow(),
    visibleCount: 1,
    hiddenAt: null,
    impressionSent: false,
    firstActionSent: false,
    participateSent: false,
  });
};

/** 노출 판정(50% 이상 · 1초 이상 연속)을 채웠을 때 호출한다. */
export const confirmImmersiveImpression = (voteId: number): void => {
  const state = impressions.get(voteId);
  // 백그라운드에서 타이머가 밀려 뒤늦게 도착한 경우는 실제로 본 게 아니므로 버린다.
  if (!state || backgroundedAt !== null) return;
  flushImpression(voteId, state);
};

/** 카드가 뷰포트 50% 아래로 내려갔을 때 호출한다. */
export const endImmersiveExposure = (voteId: number): void => {
  const state = impressions.get(voteId);
  if (!state) return;

  state.visibleCount = Math.max(0, state.visibleCount - 1);
  if (state.visibleCount === 0) state.hiddenAt = performance.now();
};

/**
 * 그 노출에서 가장 먼저 한 행동 1회만 전송한다. 이미 보냈으면 아무것도 하지 않는다.
 * 사용자가 행동했다는 건 콘텐츠를 봤다는 뜻이라, 노출 1초를 못 채웠어도 노출을 먼저 확정한다.
 * (이렇게 하지 않으면 1초 안에 투표한 사용자가 노출·첫 행동·Time to Vote에서 통째로 빠진다)
 */
export const trackImmersiveFirstAction = (voteId: number, action: ImmersiveFirstAction): void => {
  const state = impressions.get(voteId);
  if (!state || state.firstActionSent) return;

  flushImpression(voteId, state);
  state.firstActionSent = true;
  postImmersiveFirstAction(voteId, { impressionId: state.impressionId, action, elapsedMs: elapsedMsOf(state) });
};

/**
 * 아무 행동 없이 그 콘텐츠를 떠났을 때 호출한다(다음/이전 스와이프, 페이지 이탈).
 * 서버 enum에 이탈 값이 없어 SCROLL_NEXT로 보낸다 — 즉 이 값은 "무인터랙션 이탈" 전체를 뜻한다.
 * 노출로 인정되지 않은 카드(빠른 스와이프)는 보내지 않아 명세의 노출 기준을 그대로 지킨다.
 */
export const trackImmersiveLeave = (voteId: number, options?: { keepalive?: boolean }): void => {
  const state = impressions.get(voteId);
  if (!state || state.firstActionSent || !state.impressionSent) return;

  state.firstActionSent = true;
  postImmersiveFirstAction(
    voteId,
    { impressionId: state.impressionId, action: "SCROLL_NEXT", elapsedMs: elapsedMsOf(state) },
    options,
  );
};

/**
 * 투표 요청에 함께 실어 보낼 노출 정보.
 * 한 노출당 한 번만 돌려줘서 취소·재투표 요청에는 필드가 빠지고, 서버는 첫 투표만 Time to Vote로 집계한다.
 */
export const getImmersiveImpressionContext = (voteId: number): { impressionId?: string; elapsedMs?: number } => {
  const state = impressions.get(voteId);
  if (!state || state.participateSent) return {};

  flushImpression(voteId, state);
  state.participateSent = true;
  return { impressionId: state.impressionId, elapsedMs: elapsedMsOf(state) };
};

/** 투표 요청이 실패했을 때 호출한다. 재시도가 노출 정보를 다시 실을 수 있게 되돌린다. */
export const releaseImmersiveParticipateContext = (voteId: number): void => {
  const state = impressions.get(voteId);
  if (state) state.participateSent = false;
};

/** 탭이 백그라운드로 내려갔을 때. */
export const markImmersiveBackground = (): void => {
  if (backgroundedAt === null) backgroundedAt = performance.now();
};

/** 탭이 다시 앞으로 나왔을 때. */
export const markImmersiveForeground = (): void => {
  if (backgroundedAt === null) return;
  backgroundMsTotal += performance.now() - backgroundedAt;
  backgroundedAt = null;
};

/** 피드를 떠날 때 호출한다. 다음 진입에서 옛 노출의 impressionId가 재사용되지 않게 한다. */
export const resetImmersiveImpressions = (): void => {
  impressions.clear();
  backgroundMsTotal = 0;
  backgroundedAt = null;
};
