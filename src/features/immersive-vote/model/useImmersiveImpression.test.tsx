import { cleanup, render } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetImmersiveImpressions, trackImmersiveFirstAction, trackImmersiveLeave } from "./immersiveImpression";
import { useImmersiveImpression } from "./useImmersiveImpression";

const mockPostImmersiveImpression = vi.fn();
const mockPostImmersiveFirstAction = vi.fn();

vi.mock("../api/immersiveVoteTracking", () => ({
  postImmersiveImpression: (...args: unknown[]) => mockPostImmersiveImpression(...args),
  postImmersiveFirstAction: (...args: unknown[]) => mockPostImmersiveFirstAction(...args),
}));

const VOTE_ID = 101;

type Observed = { callback: IntersectionObserverCallback };
const observers: Observed[] = [];

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    observers.push({ callback });
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

/** 관측 중인 카드의 가시 비율이 바뀐 상황. */
const setIntersectionRatio = (ratio: number) => {
  const observer = observers[0];
  if (!observer) throw new Error("IntersectionObserver가 등록되지 않았다");
  observer.callback([{ intersectionRatio: ratio } as IntersectionObserverEntry], {} as IntersectionObserver);
};

const setDocumentVisibility = (state: DocumentVisibilityState) => {
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => state });
  document.dispatchEvent(new Event("visibilitychange"));
};

/** 뒤로가기로 BFCache에서 페이지가 되살아난 상황. */
const restoreFromBfCache = () => {
  const event = new Event("pageshow");
  Object.defineProperty(event, "persisted", { get: () => true });
  window.dispatchEvent(event);
};

function ImpressionProbe({ voteId, position }: { voteId: number; position: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useImmersiveImpression(ref, voteId, position);
  return <div ref={ref} />;
}

describe("useImmersiveImpression", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    setDocumentVisibility("visible");
    render(<ImpressionProbe voteId={VOTE_ID} position={0} />);
  });

  afterEach(() => {
    // vitest globals를 안 켜서 RTL 자동 정리가 돌지 않는다.
    // 남은 컴포넌트가 document 리스너를 물고 있으면 다음 테스트를 오염시킨다.
    cleanup();
    observers.length = 0;
    vi.unstubAllGlobals();
    vi.useRealTimers();
    resetImmersiveImpressions();
    vi.clearAllMocks();
  });

  it("50% 이상 1초 연속으로 보이면 노출을 보낸다", () => {
    setIntersectionRatio(0.6);

    vi.advanceTimersByTime(999);
    expect(mockPostImmersiveImpression).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(mockPostImmersiveImpression).toHaveBeenCalledTimes(1);
  });

  describe("탭 전환", () => {
    it("1초를 채우기 전에 탭이 내려가면 노출을 보내지 않는다", () => {
      setIntersectionRatio(0.6);
      vi.advanceTimersByTime(500);

      setDocumentVisibility("hidden");
      vi.advanceTimersByTime(10_000);

      expect(mockPostImmersiveImpression).not.toHaveBeenCalled();
    });

    it("탭이 돌아오면 1초를 처음부터 다시 재고 노출을 보낸다", () => {
      setIntersectionRatio(0.6);
      vi.advanceTimersByTime(500);
      setDocumentVisibility("hidden");
      vi.advanceTimersByTime(10_000);

      setDocumentVisibility("visible");

      // 백그라운드에 있던 시간은 인정하지 않으므로 복귀 직후 확정되면 안 된다.
      vi.advanceTimersByTime(999);
      expect(mockPostImmersiveImpression).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(mockPostImmersiveImpression).toHaveBeenCalledTimes(1);
    });

    it("화면에서 벗어난 카드는 탭이 돌아와도 노출을 다시 재지 않는다", () => {
      setIntersectionRatio(0.6);
      setIntersectionRatio(0);
      setDocumentVisibility("hidden");

      setDocumentVisibility("visible");
      vi.advanceTimersByTime(10_000);

      expect(mockPostImmersiveImpression).not.toHaveBeenCalled();
    });
  });

  describe("BFCache 복원", () => {
    it("이탈로 마감된 노출을 새 노출로 다시 연다", () => {
      setIntersectionRatio(0.6);
      vi.advanceTimersByTime(1_000);
      // 페이지를 떠나며 이탈을 보낸 뒤 heap이 그대로 살아 돌아온다.
      trackImmersiveLeave(VOTE_ID, { keepalive: true });

      restoreFromBfCache();
      vi.advanceTimersByTime(1_000);

      expect(mockPostImmersiveImpression).toHaveBeenCalledTimes(2);
      expect(mockPostImmersiveImpression.mock.calls[1]?.[1]).not.toEqual(
        mockPostImmersiveImpression.mock.calls[0]?.[1],
      );
    });

    it("복귀 후의 행동이 새 노출의 첫 행동으로 기록된다", () => {
      setIntersectionRatio(0.6);
      vi.advanceTimersByTime(1_000);
      trackImmersiveLeave(VOTE_ID);
      expect(mockPostImmersiveFirstAction).toHaveBeenCalledTimes(1);

      restoreFromBfCache();
      trackImmersiveFirstAction(VOTE_ID, "VOTE");

      expect(mockPostImmersiveFirstAction).toHaveBeenCalledTimes(2);
      expect(mockPostImmersiveFirstAction.mock.calls[1]?.[1]).toMatchObject({ action: "VOTE" });
    });

    it("일반 진입(BFCache 아님)에는 노출을 새로 열지 않는다", () => {
      setIntersectionRatio(0.6);
      vi.advanceTimersByTime(1_000);

      window.dispatchEvent(new Event("pageshow"));
      vi.advanceTimersByTime(1_000);

      expect(mockPostImmersiveImpression).toHaveBeenCalledTimes(1);
    });
  });
});
