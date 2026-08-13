import type { ImmersiveVoteVariant } from "../api/immersiveFeedQuery";

const IMMERSIVE_VOTE_VARIANT_STORAGE_KEY = "immersiveVoteVariant";

const isImmersiveVoteVariant = (value: unknown): value is ImmersiveVoteVariant => value === "A" || value === "B";

export const readPinnedVariant = (): ImmersiveVoteVariant | undefined => {
  if (typeof window === "undefined") return undefined;

  try {
    const saved = window.sessionStorage.getItem(IMMERSIVE_VOTE_VARIANT_STORAGE_KEY);
    return isImmersiveVoteVariant(saved) ? saved : undefined;
  } catch {
    return undefined;
  }
};

/**
 * 처음 관측한 A/B 시안을 세션에 고정한다.
 * 이미 고정된 값이 있으면 인자를 무시하고 그 값을 돌려준다.
 *
 * 피드 쿼리는 startVoteId 유무에 따라 다른 queryKey를 쓰고 refetchOnMount: "always"라서,
 * 딥링크 진입 등으로 /next를 다시 호출하면 서버가 다른 시안을 내려줄 수 있다.
 * 고정하지 않으면 세션 도중 레이아웃이 A↔B로 뒤집히고 한 사용자가 양쪽 실험군에 집계된다.
 */
export const pinVariant = (variant: ImmersiveVoteVariant): ImmersiveVoteVariant => {
  const pinned = readPinnedVariant();
  if (pinned) return pinned;

  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(IMMERSIVE_VOTE_VARIANT_STORAGE_KEY, variant);
    } catch {
      // 저장에 실패해도 이번 마운트의 메모리 상태로는 시안이 유지되므로 무시한다.
    }
  }

  return variant;
};
