import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSwipeNextVoteHint } from "./useSwipeNextVoteHint";

describe("useSwipeNextVoteHint", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("투표 후 10초 동안 인터랙션이 없으면 안내를 노출한다", () => {
    const { result } = renderHook(() => useSwipeNextVoteHint(true));

    act(() => vi.advanceTimersByTime(9_999));
    expect(result.current).toBe(false);

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe(true);
  });

  it("인터랙션이 발생하면 안내를 숨기고 10초를 다시 센다", () => {
    const { result } = renderHook(() => useSwipeNextVoteHint(true));

    act(() => vi.advanceTimersByTime(10_000));
    expect(result.current).toBe(true);

    act(() => window.dispatchEvent(new PointerEvent("pointerdown")));
    expect(result.current).toBe(false);

    act(() => vi.advanceTimersByTime(9_999));
    expect(result.current).toBe(false);

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe(true);
  });

  it("투표하지 않은 상태에서는 안내를 노출하지 않는다", () => {
    const { result } = renderHook(() => useSwipeNextVoteHint(false));

    act(() => vi.advanceTimersByTime(20_000));
    expect(result.current).toBe(false);
  });
});
