import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ImmersiveFeedItem } from "./types";
import { useImmersiveFeed } from "./useImmersiveFeed";

// immersiveFeedQueryOptions 모킹: queryFn을 제어 가능한 mock으로 교체
const mockQueryFn = vi.fn();

vi.mock("../api/immersiveFeedQuery", () => {
  const immersiveFeedQueryKey = ["immersive-votes", "feed"] as const;
  return {
    immersiveFeedQueryKey,
    immersiveFeedQueryOptions: (cursor?: number) => ({
      queryKey: cursor ? [...immersiveFeedQueryKey, cursor] : immersiveFeedQueryKey,
      queryFn: () => mockQueryFn(cursor),
      staleTime: 0,
    }),
  };
});

const makeVote = (voteId: number): ImmersiveFeedItem => ({
  voteId,
  title: `투표 ${voteId}`,
  content: "내용",
  imageUrl: null,
  status: "ONGOING",
  endAt: "2026-12-31T23:59:59Z",
  participantCount: 0,
  options: [
    { optionId: voteId * 10, label: "옵션 A", voteCount: null, ratio: null },
    { optionId: voteId * 10 + 1, label: "옵션 B", voteCount: null, ratio: null },
  ],
  myVote: { voted: false, selectedOptionId: null },
  emojiSummary: { LIKE: 0, SAD: 0, ANGRY: 0, WOW: 0, total: 0 },
  myEmoji: null,
  commentCount: 0,
  currentViewerCount: 0,
});

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => QueryClientProvider({ client: queryClient, children }) as ReactNode;
}

describe("useImmersiveFeed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("이전/다음 투표 이동", () => {
    it("첫 카드에서는 위로 스와이프해도 trackIndex가 변하지 않는다", async () => {
      const votes = [makeVote(1), makeVote(2), makeVote(3)];
      mockQueryFn.mockResolvedValue({ votes, nextCursor: null, hasNext: false });

      const queryClient = createTestQueryClient();
      const { result } = renderHook(() => useImmersiveFeed(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => expect(result.current.votes).toHaveLength(3));

      act(() => {
        result.current.handleTouchStart({ touches: [{ clientY: 0 }] } as never);
      });
      act(() => {
        result.current.handleTouchEnd({ changedTouches: [{ clientY: 200 }] } as never);
      });

      expect(result.current.trackStyle.transform).toBe("translate3d(0, -0dvh, 0)");
    });

    it("아래로 스와이프하면 trackIndex가 감소한다", async () => {
      const votes = [makeVote(1), makeVote(2), makeVote(3)];
      mockQueryFn.mockResolvedValue({ votes, nextCursor: null, hasNext: false });

      let now = 0;
      vi.spyOn(Date, "now").mockImplementation(() => {
        now += 1000;
        return now;
      });

      const queryClient = createTestQueryClient();
      const { result } = renderHook(() => useImmersiveFeed(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => expect(result.current.votes).toHaveLength(3));

      act(() => {
        result.current.handleTouchStart({ touches: [{ clientY: 200 }] } as never);
      });
      act(() => {
        result.current.handleTouchEnd({ changedTouches: [{ clientY: 0 }] } as never);
      });
      await waitFor(() => expect(result.current.trackStyle.transform).toBe("translate3d(0, -100dvh, 0)"));

      act(() => {
        result.current.handleTouchStart({ touches: [{ clientY: 0 }] } as never);
      });
      act(() => {
        result.current.handleTouchEnd({ changedTouches: [{ clientY: 200 }] } as never);
      });
      await waitFor(() => expect(result.current.trackStyle.transform).toBe("translate3d(0, -0dvh, 0)"));

      vi.spyOn(Date, "now").mockRestore();
    });
  });

  describe("handleTrackTransitionEnd — 루프 리셋", () => {
    it("trackIndex가 feedLength 이상일 때 currentIndex로 리셋하고 transition을 재활성화한다", async () => {
      const votes = [makeVote(1), makeVote(2), makeVote(3)];
      mockQueryFn.mockResolvedValue({ votes, nextCursor: null, hasNext: false });

      // double rAF 처리를 위해 requestAnimationFrame을 동기 실행하는 stub으로 교체
      let rafCallback: FrameRequestCallback | null = null;
      vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
        rafCallback = cb;
        return 0;
      });

      const queryClient = createTestQueryClient();
      const { result } = renderHook(() => useImmersiveFeed(), {
        wrapper: createWrapper(queryClient),
      });

      // 초기 데이터 로드 대기
      await waitFor(() => expect(result.current.votes).toHaveLength(3));

      // trackIndex를 feedLength(3)로 올리기 위해 goToNextVote를 3회 호출
      // goToNextVote는 외부로 노출되지 않으므로 내부 상태를 유도하기 위해
      // WHEEL_NAVIGATION_COOLDOWN_MS를 우회해야 함. Date.now를 조작한다.
      let now = 0;
      vi.spyOn(Date, "now").mockImplementation(() => {
        now += 1000;
        return now;
      });

      // 3번 이동 → trackIndex = 3 (= feedLength)
      // handleTouchEnd를 통해 goToNextVote를 간접 호출
      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.handleTouchEnd({
            changedTouches: [{ clientY: 0 }],
          } as never);
        });
        // touchStart 초기화를 위해 handleTouchStart를 먼저 호출해야 하므로 재설정
        act(() => {
          result.current.handleTouchStart({
            touches: [{ clientY: 200 }],
          } as never);
        });
        act(() => {
          result.current.handleTouchEnd({
            changedTouches: [{ clientY: 0 }],
          } as never);
        });
      }

      await waitFor(() => expect(result.current.trackStyle.transform).toContain("dvh"));

      // handleTrackTransitionEnd 호출 전 trackIndex >= feedLength 상태로 설정
      // displayedVotes 길이가 feedLength*2이므로 trackIndex가 feedLength면 리셋 대상
      act(() => {
        result.current.handleTrackTransitionEnd();
      });

      // transition 비활성화 확인: trackClassName이 비어야 함
      expect(result.current.trackClassName).toBe("");

      // double rAF 실행하여 transition 재활성화
      if (rafCallback) {
        act(() => {
          (rafCallback as FrameRequestCallback)(0);
        });
        if (rafCallback) {
          act(() => {
            (rafCallback as FrameRequestCallback)(0);
          });
        }
      }

      await waitFor(() => expect(result.current.trackClassName).toContain("transition-transform"));

      vi.unstubAllGlobals();
      vi.spyOn(Date, "now").mockRestore();
    });

    it("trackIndex가 feedLength 미만일 때 handleTrackTransitionEnd 호출 시 아무것도 하지 않는다", async () => {
      const votes = [makeVote(1), makeVote(2), makeVote(3)];
      mockQueryFn.mockResolvedValue({ votes, nextCursor: null, hasNext: false });

      const rafSpy = vi.fn();
      vi.stubGlobal("requestAnimationFrame", rafSpy);

      const queryClient = createTestQueryClient();
      const { result } = renderHook(() => useImmersiveFeed(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => expect(result.current.votes).toHaveLength(3));

      // trackIndex = 0 (초기값), feedLength = 3 → trackIndex < feedLength → early return
      act(() => {
        result.current.handleTrackTransitionEnd();
      });

      // transition 상태 변경 없음 — trackClassName 유지
      expect(result.current.trackClassName).toContain("transition-transform");
      // rAF 미호출
      expect(rafSpy).not.toHaveBeenCalled();

      vi.unstubAllGlobals();
    });
  });

  describe("prefetch — 마지막 카드 도달 시", () => {
    it("마지막 카드에 도달하고 nextCursor가 있으면 fetchQuery를 1회 호출한다", async () => {
      // votes 5개, nextCursor 있음
      const initialVotes = [makeVote(1), makeVote(2), makeVote(3), makeVote(4), makeVote(5)];
      const additionalVotes = [makeVote(6), makeVote(7)];

      mockQueryFn
        .mockResolvedValueOnce({ votes: initialVotes, nextCursor: 999, hasNext: true })
        .mockResolvedValueOnce({ votes: additionalVotes, nextCursor: null, hasNext: false });

      let now = 0;
      vi.spyOn(Date, "now").mockImplementation(() => {
        now += 1000;
        return now;
      });

      const queryClient = createTestQueryClient();
      const { result } = renderHook(() => useImmersiveFeed(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => expect(result.current.votes).toHaveLength(5));

      // 마지막 카드(currentIndex 4)까지 이동
      for (let i = 0; i < 4; i++) {
        act(() => {
          result.current.handleTouchStart({ touches: [{ clientY: 200 }] } as never);
        });
        act(() => {
          result.current.handleTouchEnd({ changedTouches: [{ clientY: 0 }] } as never);
        });
      }

      // prefetch 실행 대기
      await waitFor(() => expect(result.current.votes).toHaveLength(7));

      // cursor=999로 fetchQuery가 호출됨
      expect(mockQueryFn).toHaveBeenCalledWith(999);

      vi.spyOn(Date, "now").mockRestore();
    });

    it("isFetchingMore가 진행 중이면 fetchQuery를 추가로 호출하지 않는다", async () => {
      const initialVotes = [makeVote(1), makeVote(2), makeVote(3), makeVote(4), makeVote(5)];

      // fetchQuery를 느리게 응답하도록 설정하여 isFetchingMore.current = true 상태 유지
      let resolveFirst: ((value: unknown) => void) | null = null;
      mockQueryFn
        .mockResolvedValueOnce({ votes: initialVotes, nextCursor: 999, hasNext: true })
        .mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              resolveFirst = resolve;
            }),
        )
        .mockResolvedValue({ votes: [], nextCursor: null, hasNext: false });

      let now = 0;
      vi.spyOn(Date, "now").mockImplementation(() => {
        now += 1000;
        return now;
      });

      const queryClient = createTestQueryClient();
      const { result } = renderHook(() => useImmersiveFeed(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => expect(result.current.votes).toHaveLength(5));

      // 마지막 카드까지 이동해 prefetch 트리거
      for (let i = 0; i < 4; i++) {
        act(() => {
          result.current.handleTouchStart({ touches: [{ clientY: 200 }] } as never);
        });
        act(() => {
          result.current.handleTouchEnd({ changedTouches: [{ clientY: 0 }] } as never);
        });
      }

      // isFetchingMore가 true인 상태에서 추가 이동
      act(() => {
        result.current.handleTouchStart({ touches: [{ clientY: 200 }] } as never);
      });
      act(() => {
        result.current.handleTouchEnd({ changedTouches: [{ clientY: 0 }] } as never);
      });

      // 느린 요청 완료
      if (resolveFirst) {
        act(() => {
          (resolveFirst as (value: unknown) => void)({ votes: [], nextCursor: null, hasNext: false });
        });
      }

      await waitFor(() => expect(mockQueryFn).toHaveBeenCalledWith(999));
      // cursor=999로의 호출은 정확히 1회
      const cursorCalls = mockQueryFn.mock.calls.filter((args) => args[0] === 999);
      expect(cursorCalls).toHaveLength(1);

      vi.spyOn(Date, "now").mockRestore();
    });

    it("nextCursor가 null이면 마지막 카드에 도달해도 fetchQuery를 호출하지 않는다", async () => {
      const votes = [makeVote(1), makeVote(2), makeVote(3), makeVote(4), makeVote(5)];
      mockQueryFn.mockResolvedValue({ votes, nextCursor: null, hasNext: false });

      let now = 0;
      vi.spyOn(Date, "now").mockImplementation(() => {
        now += 1000;
        return now;
      });

      const queryClient = createTestQueryClient();
      const { result } = renderHook(() => useImmersiveFeed(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => expect(result.current.votes).toHaveLength(5));

      const callCountBefore = mockQueryFn.mock.calls.length;

      for (let i = 0; i < 4; i++) {
        act(() => {
          result.current.handleTouchStart({ touches: [{ clientY: 200 }] } as never);
        });
        act(() => {
          result.current.handleTouchEnd({ changedTouches: [{ clientY: 0 }] } as never);
        });
      }

      // nextCursor가 null이므로 추가 fetchQuery 미호출
      await waitFor(() => expect(result.current.votes).toHaveLength(5));
      expect(mockQueryFn.mock.calls.length).toBe(callCountBefore);

      vi.spyOn(Date, "now").mockRestore();
    });
  });
});
