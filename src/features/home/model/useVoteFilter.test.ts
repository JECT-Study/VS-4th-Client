import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useVoteFilter } from "./useVoteFilter.ts";

describe("useVoteFilter", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("uses default filter values when there is no saved state", () => {
    const { result } = renderHook(() => useVoteFilter());

    expect(result.current.sortType).toBe("LATEST");
    expect(result.current.excludeEnded).toBe(true);
  });

  it("keeps changed sort type after remount", () => {
    const { result, unmount } = renderHook(() => useVoteFilter());

    act(() => {
      result.current.setSortType("POPULAR");
    });

    unmount();

    const { result: remounted } = renderHook(() => useVoteFilter());

    expect(remounted.current.sortType).toBe("POPULAR");
    expect(remounted.current.excludeEnded).toBe(true);
  });

  it("keeps exclude ended filter after remount", () => {
    const { result, unmount } = renderHook(() => useVoteFilter());

    act(() => {
      result.current.changeExcludeEnded(false);
    });

    unmount();

    const { result: remounted } = renderHook(() => useVoteFilter());

    expect(remounted.current.sortType).toBe("LATEST");
    expect(remounted.current.excludeEnded).toBe(false);
  });
});
