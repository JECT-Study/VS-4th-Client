import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ImmersiveFeedItem } from "./types";
import { useImmersiveFeed } from "./useImmersiveFeed";

const mockInitialFn = vi.fn();
const mockFetchNext = vi.fn();

vi.mock("../api/immersiveFeedQuery", () => {
  const immersiveFeedQueryKey = ["immersive-votes", "feed"] as const;
  return {
    immersiveFeedQueryKey,
    immersiveFeedQueryOptions: () => ({
      queryKey: immersiveFeedQueryKey,
      queryFn: () => mockInitialFn(),
      staleTime: 0,
    }),
    fetchNextImmersiveFeed: (excludeIds: number[]) => mockFetchNext(excludeIds),
  };
});

const makeVote = (voteId: number, overrides: Partial<ImmersiveFeedItem> = {}): ImmersiveFeedItem => ({
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
  ...overrides,
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
    window.sessionStorage.clear();
  });

  describe("A/B 시안 선택", () => {
    it("피드 응답의 B variant를 그대로 사용한다", async () => {
      mockInitialFn.mockResolvedValue({ items: [makeVote(1)], variant: "B" });
      mockFetchNext.mockResolvedValue({ items: [] });

      const queryClient = createTestQueryClient();
      const { result } = renderHook(() => useImmersiveFeed(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => expect(result.current.variant).toBe("B"));
    });

    it("variant가 없으면 기본 A안을 사용한다", async () => {
      mockInitialFn.mockResolvedValue({ items: [makeVote(1)] });
      mockFetchNext.mockResolvedValue({ items: [] });

      const queryClient = createTestQueryClient();
      const { result } = renderHook(() => useImmersiveFeed(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => expect(result.current.votes).toHaveLength(1));
      expect(result.current.variant).toBe("A");
    });

    it("한 번 고정된 시안은 이후 응답이 다른 시안을 내려줘도 유지된다", async () => {
      mockInitialFn.mockResolvedValueOnce({ items: [makeVote(1)], variant: "B" });
      mockFetchNext.mockResolvedValue({ items: [] });

      const { result, unmount } = renderHook(() => useImmersiveFeed(), {
        wrapper: createWrapper(createTestQueryClient()),
      });

      await waitFor(() => expect(result.current.variant).toBe("B"));
      unmount();

      // startVoteId 딥링크 진입처럼 /next를 다시 호출해 A안이 내려오는 상황
      mockInitialFn.mockResolvedValue({ items: [makeVote(2)], variant: "A" });

      const { result: remounted } = renderHook(() => useImmersiveFeed(1), {
        wrapper: createWrapper(createTestQueryClient()),
      });

      await waitFor(() => expect(remounted.current.votes).toHaveLength(1));
      expect(remounted.current.variant).toBe("B");
    });

    it("세션에 고정된 시안이 있으면 응답을 기다리지 않고 그 시안으로 시작한다", () => {
      window.sessionStorage.setItem("immersiveVoteVariant", "B");
      mockInitialFn.mockResolvedValue({ items: [makeVote(1)] });
      mockFetchNext.mockResolvedValue({ items: [] });

      const { result } = renderHook(() => useImmersiveFeed(), {
        wrapper: createWrapper(createTestQueryClient()),
      });

      expect(result.current.variant).toBe("B");
    });
  });

  describe("피드 항목 필터링", () => {
    it("초기 피드에서 종료된 투표와 이미 참여한 투표를 제외한다", async () => {
      mockInitialFn.mockResolvedValue({
        items: [
          makeVote(1),
          makeVote(2, { myVote: { voted: true, selectedOptionId: 20 } }),
          makeVote(3, { status: "ENDED" }),
        ],
      });
      mockFetchNext.mockResolvedValue({ items: [] });

      const queryClient = createTestQueryClient();
      const { result } = renderHook(() => useImmersiveFeed(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => expect(result.current.votes.map((vote) => vote.voteId)).toEqual([1]));
    });

    it("초기 피드에서 같은 voteId가 중복으로 내려오면 한 번만 표시한다", async () => {
      mockInitialFn.mockResolvedValue({
        items: [makeVote(1), makeVote(1), makeVote(2)],
      });
      mockFetchNext.mockResolvedValue({ items: [] });

      const queryClient = createTestQueryClient();
      const { result } = renderHook(() => useImmersiveFeed(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => expect(result.current.votes.map((vote) => vote.voteId)).toEqual([1, 2]));
    });

    it("status가 없는 피드 응답 항목도 진행중 투표로 간주해 표시한다", async () => {
      mockInitialFn.mockResolvedValue({
        items: [makeVote(1, { status: undefined }), makeVote(2, { status: undefined })],
      });
      mockFetchNext.mockResolvedValue({ items: [] });

      const queryClient = createTestQueryClient();
      const { result } = renderHook(() => useImmersiveFeed(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => expect(result.current.votes.map((vote) => vote.voteId)).toEqual([1, 2]));
    });

    it("추가 피드에서도 종료된 투표, 이미 참여한 투표, 이전에 노출된 투표를 제외한다", async () => {
      const initialVotes = [makeVote(1), makeVote(2), makeVote(3), makeVote(4), makeVote(5)];
      const nextVotes = [
        makeVote(6, { myVote: { voted: true, selectedOptionId: 60 } }),
        makeVote(7, { status: "ENDED" }),
        makeVote(2),
        makeVote(8),
        makeVote(8),
      ];

      mockInitialFn.mockResolvedValue({ items: initialVotes });
      mockFetchNext.mockResolvedValueOnce({ items: nextVotes });

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

      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.handleTouchStart({ touches: [{ clientY: 200 }] } as never);
        });
        act(() => {
          result.current.handleTouchEnd({ changedTouches: [{ clientY: 0 }] } as never);
        });
      }

      await waitFor(() => expect(result.current.votes.map((vote) => vote.voteId)).toEqual([1, 2, 3, 4, 5, 8]));
      expect(mockFetchNext.mock.calls[0]?.[0]).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]));

      vi.spyOn(Date, "now").mockRestore();
    });
  });

  describe("handleTrackTransitionEnd — 루프 리셋", () => {
    it("trackIndex가 feedLength 이상일 때 currentIndex로 리셋하고 transition을 재활성화한다", async () => {
      const votes = [makeVote(1), makeVote(2), makeVote(3)];
      mockInitialFn.mockResolvedValue({ items: votes });
      mockFetchNext.mockResolvedValue({ items: [] }); // 소진 시 isExhausted=true → 루프 방지

      let rafCallback: FrameRequestCallback | null = null;
      vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
        rafCallback = cb;
        return 0;
      });

      const queryClient = createTestQueryClient();
      const { result } = renderHook(() => useImmersiveFeed(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => expect(result.current.votes).toHaveLength(3));

      let now = 0;
      vi.spyOn(Date, "now").mockImplementation(() => {
        now += 1000;
        return now;
      });

      // 3번 이동 → trackIndex = 3 (= feedLength)
      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.handleTouchEnd({
            changedTouches: [{ clientY: 0 }],
          } as never);
        });
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

      act(() => {
        result.current.handleTrackTransitionEnd();
      });

      expect(result.current.trackClassName).toBe("");

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
      mockInitialFn.mockResolvedValue({ items: votes });
      mockFetchNext.mockResolvedValue({ items: [] }); // 소진 시 isExhausted=true → 루프 방지

      const rafSpy = vi.fn();
      vi.stubGlobal("requestAnimationFrame", rafSpy);

      const queryClient = createTestQueryClient();
      const { result } = renderHook(() => useImmersiveFeed(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => expect(result.current.votes).toHaveLength(3));

      act(() => {
        result.current.handleTrackTransitionEnd();
      });

      expect(result.current.trackClassName).toContain("transition-transform");
      expect(rafSpy).not.toHaveBeenCalled();

      vi.unstubAllGlobals();
    });
  });

  describe("prefetch — 임계값 트리거", () => {
    it("feedLength - currentIndex <= PREFETCH_THRESHOLD이면 fetchNextImmersiveFeed를 seenIds로 호출한다", async () => {
      const initialVotes = [makeVote(1), makeVote(2), makeVote(3), makeVote(4), makeVote(5)];
      const additionalVotes = [makeVote(6), makeVote(7)];

      mockInitialFn.mockResolvedValue({ items: initialVotes });
      mockFetchNext.mockResolvedValueOnce({ items: additionalVotes });

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

      // currentIndex를 3으로 올린다 (feedLength 5 - currentIndex 3 = 2 <= PREFETCH_THRESHOLD 3)
      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.handleTouchStart({ touches: [{ clientY: 200 }] } as never);
        });
        act(() => {
          result.current.handleTouchEnd({ changedTouches: [{ clientY: 0 }] } as never);
        });
      }

      await waitFor(() => expect(result.current.votes).toHaveLength(7));

      // fetchNextImmersiveFeed가 초기 seenIds [1,2,3,4,5]로 1회 호출됨
      expect(mockFetchNext.mock.calls).toHaveLength(1);
      expect(mockFetchNext.mock.calls[0]?.[0]).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]));

      vi.spyOn(Date, "now").mockRestore();
    });

    it("isFetchingMore가 진행 중이면 fetchNextImmersiveFeed를 추가로 호출하지 않는다", async () => {
      const initialVotes = [makeVote(1), makeVote(2), makeVote(3), makeVote(4), makeVote(5)];

      let resolveFirst: ((value: unknown) => void) | null = null;
      mockInitialFn.mockResolvedValue({ items: initialVotes });
      mockFetchNext
        .mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              resolveFirst = resolve;
            }),
        )
        .mockResolvedValue({ items: [] });

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

      // 첫 번째 이동으로 prefetch 트리거
      for (let i = 0; i < 3; i++) {
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
          (resolveFirst as (value: unknown) => void)({ items: [] });
        });
      }

      // seenIds([1..5])로의 호출은 정확히 1회 (isFetchingMore로 중복 차단됨)
      await waitFor(() => {
        const seenIdsCalls = mockFetchNext.mock.calls.filter((call) => call[0].length > 0);
        expect(seenIdsCalls).toHaveLength(1);
      });

      vi.spyOn(Date, "now").mockRestore();
    });

    it("빈 items 반환 시 소진 상태로 처리하고 이전 투표를 재요청하지 않는다", async () => {
      const initialVotes = [makeVote(1), makeVote(2), makeVote(3), makeVote(4), makeVote(5)];

      mockInitialFn.mockResolvedValue({ items: initialVotes });
      mockFetchNext.mockResolvedValueOnce({ items: [] });

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

      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.handleTouchStart({ touches: [{ clientY: 200 }] } as never);
        });
        act(() => {
          result.current.handleTouchEnd({ changedTouches: [{ clientY: 0 }] } as never);
        });
      }

      await waitFor(() => expect(mockFetchNext).toHaveBeenCalledTimes(1));
      expect(result.current.votes.map((vote) => vote.voteId)).toEqual([1, 2, 3, 4, 5]);

      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.handleTouchStart({ touches: [{ clientY: 200 }] } as never);
        });
        act(() => {
          result.current.handleTouchEnd({ changedTouches: [{ clientY: 0 }] } as never);
        });
      }

      expect(mockFetchNext).toHaveBeenCalledTimes(1);

      vi.spyOn(Date, "now").mockRestore();
    });
  });
});
