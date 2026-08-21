import { showToast } from "@base/ui/Toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FreeVotesResponse } from "../api/freeVotesQuery";
import type { VoteDetail } from "./types";
import { useVoteDetail } from "./useVoteDetail";

// ── 모듈 모킹 ──────────────────────────────────────────────────────────────────

vi.mock("@base/ui/Toast", () => ({
  showToast: { info: vi.fn(), success: vi.fn(), warning: vi.fn(), hot: vi.fn() },
}));

const mockParticipateVote = vi.fn();
const mockCancelVote = vi.fn();

vi.mock("../api/voteParticipate", () => ({
  participateVote: (...args: unknown[]) => mockParticipateVote(...args),
  cancelVote: (...args: unknown[]) => mockCancelVote(...args),
}));

const mockReactEmoji = vi.fn();

vi.mock("../api/voteEmoji", () => ({
  reactEmoji: (...args: unknown[]) => mockReactEmoji(...args),
}));

vi.mock("@features/auth/api/userQuery", () => ({
  userQueryOptions: () => ({
    queryKey: ["user", "me"],
    queryFn: () => Promise.resolve(null),
    staleTime: Number.POSITIVE_INFINITY,
  }),
}));

vi.mock("../api/freeVotesQuery", () => ({
  freeVotesQueryKey: ["me", "free-votes"],
  freeVotesQueryOptions: () => ({
    queryKey: ["me", "free-votes"],
    queryFn: () => Promise.resolve({ remainingFreeVotes: 5, totalFreeVotes: 5 }),
    staleTime: Number.POSITIVE_INFINITY,
  }),
}));

vi.mock("../api/voteDetailQuery", () => ({
  voteDetailQueryOptions: (voteId: string) => ({
    queryKey: ["votes", voteId],
    queryFn: () => Promise.resolve(null),
    staleTime: Number.POSITIVE_INFINITY,
  }),
}));

vi.mock("../api/voteResultQuery", () => ({
  voteResultQueryOptions: (voteId: string) => ({
    queryKey: ["votes", voteId, "result"],
    queryFn: () => Promise.resolve(null),
    staleTime: Number.POSITIVE_INFINITY,
  }),
}));

// ── 테스트 픽스처 ───────────────────────────────────────────────────────────────

const VOTE_ID = "42";

const makeVoteDetail = (overrides: Partial<VoteDetail> = {}): VoteDetail => ({
  voteId: 42,
  title: "테스트 투표",
  createdAt: "2026-01-01T00:00:00Z",
  content: "내용",
  thumbnailUrl: null,
  status: "ONGOING",
  endAt: "2026-12-31T23:59:59Z",
  participantCount: 10,
  options: [
    { optionId: 10, label: "옵션 A", voteCount: 7, ratio: 70 },
    { optionId: 11, label: "옵션 B", voteCount: 3, ratio: 30 },
  ],
  myVote: { voted: false, selectedOptionId: null },
  emojiSummary: { LIKE: 5, SAD: 2, ANGRY: 1, WOW: 3 },
  myEmoji: null,
  commentCount: 0,
  ...overrides,
});

const makeUser = (overrides = {}) => ({
  email: "test@example.com",
  nickname: "테스터",
  birthDate: "1998-03-15",
  gender: "MALE" as const,
  imageColor: "#9A9AF6",
  userStatus: "ACTIVE",
  ...overrides,
});

// ── 헬퍼 ──────────────────────────────────────────────────────────────────────

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function renderUseVoteDetail(queryClient: QueryClient) {
  return renderHook(() => useVoteDetail(VOTE_ID), {
    wrapper: createWrapper(queryClient),
  });
}

function seedVoteDetail(queryClient: QueryClient, overrides: Partial<VoteDetail> = {}) {
  queryClient.setQueryData<VoteDetail>(["votes", VOTE_ID], makeVoteDetail(overrides));
}

function seedLoggedInUser(queryClient: QueryClient) {
  queryClient.setQueryData(["user", "me"], makeUser());
}

function seedGuest(queryClient: QueryClient) {
  queryClient.setQueryData<null>(["user", "me"], null);
}

function seedFreeVotes(queryClient: QueryClient, overrides: Partial<FreeVotesResponse> = {}) {
  queryClient.setQueryData<FreeVotesResponse>(["me", "free-votes"], {
    remainingFreeVotes: 5,
    totalFreeVotes: 5,
    ...overrides,
  });
}

function getCachedVoteDetail(queryClient: QueryClient) {
  return queryClient.getQueryData<VoteDetail>(["votes", VOTE_ID]);
}

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

// ── 테스트 ────────────────────────────────────────────────────────────────────

describe("useVoteDetail — voteUserType 분기", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  it("user가 null이면 voteUserType이 'guest'이다", async () => {
    seedVoteDetail(queryClient);
    seedGuest(queryClient);

    const { result } = renderUseVoteDetail(queryClient);

    await waitFor(() => expect(result.current.voteUserType).toBe("guest"));
  });

  it("로그인 유저이고 아직 투표하지 않았으면 voteUserType이 'member-not-voted'이다", async () => {
    seedVoteDetail(queryClient, { myVote: { voted: false, selectedOptionId: null } });
    seedLoggedInUser(queryClient);

    const { result } = renderUseVoteDetail(queryClient);

    await waitFor(() => expect(result.current.voteUserType).toBe("member-not-voted"));
  });

  it("로그인 유저이고 이미 투표했으면 voteUserType이 'member-voted'이다", async () => {
    seedVoteDetail(queryClient, { myVote: { voted: true, selectedOptionId: 10 } });
    seedLoggedInUser(queryClient);

    const { result } = renderUseVoteDetail(queryClient);

    await waitFor(() => expect(result.current.voteUserType).toBe("member-voted"));
  });
});

describe("useVoteDetail — handleOptionClick 분기", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
    mockParticipateVote.mockResolvedValue({
      voteId: 42,
      selectedOptionId: 10,
      options: [],
      participantCount: 11,
      remainingFreeVotes: null,
    });
  });

  it("이미 투표한 경우 옵션 클릭 시 participateVote를 호출하지 않는다", async () => {
    seedVoteDetail(queryClient, { myVote: { voted: true, selectedOptionId: 10 } });
    seedLoggedInUser(queryClient);

    const { result } = renderUseVoteDetail(queryClient);

    await waitFor(() => expect(result.current.voteUserType).toBe("member-voted"));

    act(() => {
      result.current.handleOptionClick(11);
    });

    expect(mockParticipateVote).not.toHaveBeenCalled();
  });

  it("게스트이고 무료 투표 횟수가 0이면 participateVote를 호출하지 않고 FreeVoteLimit 모달을 연다", async () => {
    seedVoteDetail(queryClient);
    seedGuest(queryClient);
    seedFreeVotes(queryClient, { remainingFreeVotes: 0 });

    const { result } = renderUseVoteDetail(queryClient);

    await waitFor(() => expect(result.current.voteUserType).toBe("guest"));

    act(() => {
      result.current.handleOptionClick(10);
    });

    expect(mockParticipateVote).not.toHaveBeenCalled();
    expect(result.current.isFreeVoteLimitModalOpen).toBe(true);
  });

  it("투표 가능한 정상 케이스에서 옵션 클릭 시 participateVote가 호출된다", async () => {
    seedVoteDetail(queryClient);
    seedLoggedInUser(queryClient);

    const { result } = renderUseVoteDetail(queryClient);

    await waitFor(() => expect(result.current.voteUserType).toBe("member-not-voted"));

    act(() => {
      result.current.handleOptionClick(10);
    });

    await waitFor(() => expect(mockParticipateVote).toHaveBeenCalledWith(VOTE_ID, 10));
  });
});

describe("useVoteDetail — participateMutation 낙관적 업데이트", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  it("옵션 선택 직후 onMutate로 myVote가 즉시 반영된다", async () => {
    const deferred = createDeferred<{
      voteId: number;
      selectedOptionId: number;
      options: VoteDetail["options"];
      participantCount: number;
      remainingFreeVotes: number | null;
    }>();
    mockParticipateVote.mockReturnValue(deferred.promise);

    seedVoteDetail(queryClient);
    seedLoggedInUser(queryClient);

    const { result } = renderUseVoteDetail(queryClient);

    await waitFor(() => expect(result.current.voteUserType).toBe("member-not-voted"));

    act(() => {
      result.current.handleOptionClick(10);
    });

    await waitFor(() => {
      const cached = getCachedVoteDetail(queryClient);
      expect(cached?.myVote).toEqual({ voted: true, selectedOptionId: 10 });
      expect(cached?.participantCount).toBe(10);
      expect(cached?.options).toEqual(makeVoteDetail().options);
    });

    deferred.resolve({
      voteId: 42,
      selectedOptionId: 10,
      options: makeVoteDetail().options,
      participantCount: 10,
      remainingFreeVotes: null,
    });
    await waitFor(() => expect(mockParticipateVote).toHaveBeenCalledWith(VOTE_ID, 10));
  });

  it("participateVote 성공 시 서버 응답으로 options와 participantCount를 동기화한다", async () => {
    const participateResponse = {
      voteId: 42,
      selectedOptionId: 10,
      options: [
        { optionId: 10, label: "옵션 A", voteCount: 8, ratio: 73 },
        { optionId: 11, label: "옵션 B", voteCount: 3, ratio: 27 },
      ],
      participantCount: 11,
      remainingFreeVotes: null,
    };
    mockParticipateVote.mockResolvedValue(participateResponse);

    seedVoteDetail(queryClient);
    seedLoggedInUser(queryClient);

    const { result } = renderUseVoteDetail(queryClient);

    await waitFor(() => expect(result.current.voteUserType).toBe("member-not-voted"));

    act(() => {
      result.current.handleOptionClick(10);
    });

    await waitFor(() => {
      const cached = getCachedVoteDetail(queryClient);
      expect(cached?.myVote).toEqual({ voted: true, selectedOptionId: 10 });
      expect(cached?.options).toEqual(participateResponse.options);
      expect(cached?.participantCount).toBe(11);
    });
  });

  it("participateVote 성공 시 홈 쿼리를 invalidate한다", async () => {
    mockParticipateVote.mockResolvedValue({
      voteId: 42,
      selectedOptionId: 10,
      options: [
        { optionId: 10, label: "옵션 A", voteCount: 8, ratio: 73 },
        { optionId: 11, label: "옵션 B", voteCount: 3, ratio: 27 },
      ],
      participantCount: 11,
      remainingFreeVotes: null,
    });

    seedVoteDetail(queryClient);
    seedLoggedInUser(queryClient);

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderUseVoteDetail(queryClient);

    await waitFor(() => expect(result.current.voteUserType).toBe("member-not-voted"));

    act(() => {
      result.current.handleOptionClick(10);
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith(expect.objectContaining({ queryKey: ["home"] }));
    });
  });

  it("participateVote 실패 시 myVote를 이전 상태로 롤백한다", async () => {
    const deferred = createDeferred<never>();
    mockParticipateVote.mockReturnValue(deferred.promise);

    seedVoteDetail(queryClient);
    seedLoggedInUser(queryClient);

    const { result } = renderUseVoteDetail(queryClient);

    await waitFor(() => expect(result.current.voteUserType).toBe("member-not-voted"));

    act(() => {
      result.current.handleOptionClick(10);
    });

    await waitFor(() => {
      expect(getCachedVoteDetail(queryClient)?.myVote).toEqual({ voted: true, selectedOptionId: 10 });
    });

    deferred.reject(new Error("participate failed"));

    await waitFor(() => {
      expect(getCachedVoteDetail(queryClient)?.myVote).toEqual({ voted: false, selectedOptionId: null });
    });
  });

  it("게스트가 무료 투표 한도 초과 에러를 받으면 모달을 연다", async () => {
    const deferred = createDeferred<never>();
    mockParticipateVote.mockReturnValue(deferred.promise);

    seedVoteDetail(queryClient);
    seedGuest(queryClient);
    seedFreeVotes(queryClient, { remainingFreeVotes: 1 });

    const { result } = renderUseVoteDetail(queryClient);

    await waitFor(() => expect(result.current.voteUserType).toBe("guest"));

    act(() => {
      result.current.handleOptionClick(10);
    });

    deferred.reject({
      isAxiosError: true,
      response: { data: { code: "VOTE_FREE_LIMIT_EXCEEDED" } },
    });

    await waitFor(() => {
      expect(result.current.isFreeVoteLimitModalOpen).toBe(true);
    });
  });

  it("게스트가 무료 투표에 성공하면 남은 횟수 캐시를 갱신하고 토스트를 띄운다", async () => {
    mockParticipateVote.mockResolvedValue({
      voteId: 42,
      selectedOptionId: 10,
      options: makeVoteDetail().options,
      participantCount: 11,
      remainingFreeVotes: 2,
    });

    seedVoteDetail(queryClient);
    seedGuest(queryClient);
    seedFreeVotes(queryClient, { remainingFreeVotes: 3 });

    const { result } = renderUseVoteDetail(queryClient);

    await waitFor(() => expect(result.current.voteUserType).toBe("guest"));

    act(() => {
      result.current.handleOptionClick(10);
    });

    await waitFor(() => {
      expect(queryClient.getQueryData<FreeVotesResponse>(["me", "free-votes"])).toEqual({
        remainingFreeVotes: 2,
        totalFreeVotes: 5,
      });
      expect(showToast.info).toHaveBeenCalledWith("남은 무료 투표 2회");
    });
  });
});

describe("useVoteDetail — cancelMutation", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
    mockCancelVote.mockResolvedValue(undefined);
  });

  it("cancelVote를 voteId와 함께 호출하고 성공 후 detail 쿼리를 invalidate한다", async () => {
    seedVoteDetail(queryClient, { myVote: { voted: true, selectedOptionId: 10 } });
    seedLoggedInUser(queryClient);

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderUseVoteDetail(queryClient);

    await waitFor(() => expect(result.current.voteUserType).toBe("member-voted"));

    await act(async () => {
      result.current.cancelMutation.mutate();
    });

    await waitFor(() => {
      expect(mockCancelVote).toHaveBeenCalledWith(VOTE_ID);
      expect(invalidateSpy).toHaveBeenCalledWith(expect.objectContaining({ queryKey: ["votes", VOTE_ID] }));
      expect(invalidateSpy).toHaveBeenCalledWith(expect.objectContaining({ queryKey: ["home"] }));
    });
  });
});

describe("useVoteDetail — emojiMutation 토글", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  it("같은 이모지를 다시 누르면 onMutate에서 즉시 토글 off 된다", async () => {
    const deferred = createDeferred<{
      emojiSummary: { LIKE: number; SAD: number; ANGRY: number; WOW: number; total: number };
      myEmoji: null;
    }>();
    mockReactEmoji.mockReturnValue(deferred.promise);

    seedVoteDetail(queryClient, { myEmoji: "LIKE", emojiSummary: { LIKE: 5, SAD: 2, ANGRY: 1, WOW: 3 } });
    seedLoggedInUser(queryClient);

    const { result } = renderUseVoteDetail(queryClient);

    await waitFor(() => expect(result.current.data?.myEmoji).toBe("LIKE"));

    act(() => {
      result.current.emojiMutation.mutate("LIKE");
    });

    await waitFor(() => {
      expect(getCachedVoteDetail(queryClient)?.myEmoji).toBeNull();
      expect(getCachedVoteDetail(queryClient)?.emojiSummary.LIKE).toBe(4);
    });

    deferred.resolve({
      emojiSummary: { LIKE: 4, SAD: 2, ANGRY: 1, WOW: 3, total: 10 },
      myEmoji: null,
    });
    await waitFor(() => expect(mockReactEmoji).toHaveBeenCalledWith(VOTE_ID, "LIKE"));
  });

  it("다른 이모지로 교체하면 onMutate에서 즉시 카운트를 재계산한다", async () => {
    const deferred = createDeferred<{
      emojiSummary: { LIKE: number; SAD: number; ANGRY: number; WOW: number; total: number };
      myEmoji: "SAD";
    }>();
    mockReactEmoji.mockReturnValue(deferred.promise);

    seedVoteDetail(queryClient, { myEmoji: "LIKE", emojiSummary: { LIKE: 5, SAD: 2, ANGRY: 1, WOW: 3 } });
    seedLoggedInUser(queryClient);

    const { result } = renderUseVoteDetail(queryClient);

    await waitFor(() => expect(result.current.data?.myEmoji).toBe("LIKE"));

    act(() => {
      result.current.emojiMutation.mutate("SAD");
    });

    await waitFor(() => {
      const cached = getCachedVoteDetail(queryClient);
      expect(cached?.myEmoji).toBe("SAD");
      expect(cached?.emojiSummary.LIKE).toBe(4);
      expect(cached?.emojiSummary.SAD).toBe(3);
    });

    deferred.resolve({
      emojiSummary: { LIKE: 4, SAD: 3, ANGRY: 1, WOW: 3, total: 11 },
      myEmoji: "SAD",
    });
    await waitFor(() => expect(mockReactEmoji).toHaveBeenCalledWith(VOTE_ID, "SAD"));
  });

  it("emojiMutation 실패 시 이전 myEmoji와 summary로 롤백한다", async () => {
    const deferred = createDeferred<never>();
    mockReactEmoji.mockReturnValue(deferred.promise);

    seedVoteDetail(queryClient, { myEmoji: "LIKE", emojiSummary: { LIKE: 5, SAD: 2, ANGRY: 1, WOW: 3 } });
    seedLoggedInUser(queryClient);

    const { result } = renderUseVoteDetail(queryClient);

    await waitFor(() => expect(result.current.data?.myEmoji).toBe("LIKE"));

    act(() => {
      result.current.emojiMutation.mutate("SAD");
    });

    await waitFor(() => {
      expect(getCachedVoteDetail(queryClient)?.myEmoji).toBe("SAD");
    });

    deferred.reject(new Error("emoji failed"));

    await waitFor(() => {
      expect(getCachedVoteDetail(queryClient)?.myEmoji).toBe("LIKE");
      expect(getCachedVoteDetail(queryClient)?.emojiSummary).toEqual({
        LIKE: 5,
        SAD: 2,
        ANGRY: 1,
        WOW: 3,
      });
    });
  });

  it("emojiMutation 성공 시 서버 응답값으로 최종 동기화한다", async () => {
    mockReactEmoji.mockResolvedValue({
      emojiSummary: { LIKE: 4, SAD: 2, ANGRY: 1, WOW: 3, total: 10 },
      myEmoji: null,
    });

    seedVoteDetail(queryClient, { myEmoji: "LIKE", emojiSummary: { LIKE: 5, SAD: 2, ANGRY: 1, WOW: 3 } });
    seedLoggedInUser(queryClient);

    const { result } = renderUseVoteDetail(queryClient);

    await waitFor(() => expect(result.current.data?.myEmoji).toBe("LIKE"));

    act(() => {
      result.current.emojiMutation.mutate("LIKE");
    });

    await waitFor(() => {
      const cached = getCachedVoteDetail(queryClient);
      expect(cached?.myEmoji).toBeNull();
      expect(cached?.emojiSummary).toEqual({
        LIKE: 4,
        SAD: 2,
        ANGRY: 1,
        WOW: 3,
      });
    });
  });

  it("서버 응답이 낙관적 계산과 달라도 최종 상태는 서버 응답을 따른다", async () => {
    mockReactEmoji.mockResolvedValue({
      emojiSummary: { LIKE: 2, SAD: 7, ANGRY: 1, WOW: 3, total: 13 },
      myEmoji: "SAD",
    });

    seedVoteDetail(queryClient, { myEmoji: "LIKE", emojiSummary: { LIKE: 5, SAD: 2, ANGRY: 1, WOW: 3 } });
    seedLoggedInUser(queryClient);

    const { result } = renderUseVoteDetail(queryClient);

    await waitFor(() => expect(result.current.data?.myEmoji).toBe("LIKE"));

    act(() => {
      result.current.emojiMutation.mutate("SAD");
    });

    await waitFor(() => {
      const cached = getCachedVoteDetail(queryClient);
      expect(cached?.myEmoji).toBe("SAD");
      expect(cached?.emojiSummary).toEqual({
        LIKE: 2,
        SAD: 7,
        ANGRY: 1,
        WOW: 3,
      });
    });
  });
});
