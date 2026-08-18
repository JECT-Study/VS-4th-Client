export const SWIPE_UP_THRESHOLD = 80;
export const SWIPE_DOWN_THRESHOLD = 80;
export const WHEEL_NAVIGATION_THRESHOLD = 40;
export const WHEEL_NAVIGATION_COOLDOWN_MS = 700;
export const FLOATING_EMOJI_DURATION_MS = 1200;
export const FLOATING_EMOJI_TRAVEL_PX = 120;
export const PREFETCH_THRESHOLD = 3;
export const LIVE_TOAST_MIN_VIEWERS = 10;
export const LIVE_TOAST_INTERVAL_MS = 60_000;
export const IMPRESSION_VISIBLE_RATIO = 0.5;
export const IMPRESSION_DWELL_MS = 1000;
// 무한 캐러셀은 같은 투표를 두 벌 렌더해서, 마지막에서 처음으로 되감을 때 노출이 잠깐 끊긴다.
// 이 시간 안에 다시 보이면 새 노출이 아니라 같은 노출이 이어진 것으로 본다.
export const IMPRESSION_RESUME_GRACE_MS = 400;
