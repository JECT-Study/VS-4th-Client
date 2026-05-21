import { showToast } from "@base/ui/Toast";
import type { FreeVotesResponse } from "@features/votes/api/freeVotesQuery";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { AxiosError } from "axios";
import { type ReactNode, useCallback, useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ImmersiveFeedItem } from "./types";
import { useImmersiveVote } from "./useImmersiveVote";

vi.mock("@base/ui/Toast", () => ({
  showToast: { info: vi.fn(), success: vi.fn(), warning: vi.fn(), hot: vi.fn() },
}));

const mockImmersiveParticipate = vi.fn();

vi.mock("../api/immersiveVoteParticipate", () => ({
  immersiveParticipate: (...args: unknown[]) => mockImmersiveParticipate(...args),
}));

const mockImmersiveReactEmoji = vi.fn();

vi.mock("../api/immersiveVoteEmoji", () => ({
  immersiveReactEmoji: (...args: unknown[]) => mockImmersiveReactEmoji(...args),
}));

vi.mock("@features/auth/api/userQuery", () => ({
  userQueryOptions: () => ({
    queryKey: ["user", "me"],
    queryFn: () => Promise.resolve(null),
    staleTime: Number.POSITIVE_INFINITY,
  }),
}));

vi.mock("@features/votes/api/freeVotesQuery", () => ({
  freeVotesQueryKey: ["me", "free-votes"],
  freeVotesQueryOptions: () => ({
    queryKey: ["me", "free-votes"],
    queryFn: () => Promise.resolve({ remainingFreeVotes: 5, totalFreeVotes: 5 }),
    staleTime: Number.POSITIVE_INFINITY,
  }),
}));

const makeVote = (overrides: Partial<ImmersiveFeedItem> = {}): ImmersiveFeedItem => ({
  voteId: 101,
  title: "테스트 투표",
  content: "테스트 내용",
  imageUrl: null,
  status: "ONGOING",
  endAt: "2026-12-31T23:59:59Z",
  participantCount: 10,
  options: [
    { optionId: 10, label: "옵션 A", voteCount: null, ratio: null },
    { optionId: 11, label: "옵션 B", voteCount: null, ratio: null },
  ],
  myVote: { voted: false, selectedOptionId: null },
  emojiSummary: { LIKE: 5, SAD: 2, ANGRY: 1, WOW: 3, total: 11 },
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
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function seedGuest(queryClient: QueryClient, remainingFreeVotes = 5) {
  queryClient.setQueryData<null>(["user", "me"], null);
  queryClient.setQueryData<FreeVotesResponse>(["me", "free-votes"], {
    remainingFreeVotes,
    totalFreeVotes: 5,
  });
}

function seedMember(queryClient: QueryClient) {
  queryClient.setQueryData(["user", "me"], {
    email: "test@example.com",
    nickname: "테스터",
    birthDate: "1998-03-15",
    gender: "MALE",
    imageColor: "#9A9AF6",
    userStatus: "ACTIVE",
  });
}

function renderUseImmersiveVote(queryClient: QueryClient, initialVote: ImmersiveFeedItem, onLimit = vi.fn()) {
  const hook = renderHook(
    () => {
      const [vote, setVote] = useState(initialVote);
      const updateVote = useCallback((voteId: number, updater: (vote: ImmersiveFeedItem) => ImmersiveFeedItem) => {
        setVote((current) => (current.voteId === voteId ? updater(current) : current));
      }, []);

      return {
        vote,
        ...useImmersiveVote(vote, updateVote, onLimit),
      };
    },
    { wrapper: createWrapper(queryClient) },
  );

  return { result: hook.result, onLimit };
}

describe("useImmersiveVote", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("비회원 무료 투표가 0회이면 신규 투표를 API 호출 없이 제한한다", () => {
    const queryClient = createTestQueryClient();
    seedGuest(queryClient, 0);
    const { result, onLimit } = renderUseImmersiveVote(queryClient, makeVote());

    act(() => result.current.handleOptionClick(10));

    expect(mockImmersiveParticipate).not.toHaveBeenCalled();
    expect(onLimit).toHaveBeenCalledTimes(1);
  });

  it("비회원 무료 투표가 0회여도 기존 투표 취소는 허용한다", async () => {
    const queryClient = createTestQueryClient();
    seedGuest(queryClient, 0);
    mockImmersiveParticipate.mockResolvedValue({
      voteId: 101,
      action: "CANCELED",
      selectedOptionId: null,
      options: [
        { optionId: 10, label: "옵션 A", voteCount: null, ratio: null },
        { optionId: 11, label: "옵션 B", voteCount: null, ratio: null },
      ],
      remainingFreeVotes: 0,
    });

    const { result, onLimit } = renderUseImmersiveVote(
      queryClient,
      makeVote({
        participantCount: 11,
        myVote: { voted: true, selectedOptionId: 10 },
        options: [
          { optionId: 10, label: "옵션 A", voteCount: 8, ratio: 73 },
          { optionId: 11, label: "옵션 B", voteCount: 3, ratio: 27 },
        ],
      }),
    );

    act(() => result.current.handleOptionClick(10));

    await waitFor(() => expect(mockImmersiveParticipate).toHaveBeenCalledWith(101, 10));
    expect(onLimit).not.toHaveBeenCalled();
    await waitFor(() => expect(result.current.vote.myVote.voted).toBe(false));
  });

  it("투표 실패 시 optimistic 변경을 롤백하고 실패 토스트를 띄운다", async () => {
    const queryClient = createTestQueryClient();
    seedMember(queryClient);
    mockImmersiveParticipate.mockRejectedValue(new Error("failed"));
    const initialVote = makeVote();
    const { result } = renderUseImmersiveVote(queryClient, initialVote);

    act(() => result.current.handleOptionClick(10));

    await waitFor(() => expect(showToast.warning).toHaveBeenCalledWith("투표에 실패했어요"));
    expect(result.current.vote.myVote).toEqual(initialVote.myVote);
    expect(result.current.vote.options).toEqual(initialVote.options);
    expect(result.current.vote.participantCount).toBe(initialVote.participantCount);
  });

  it("이모지 실패 시 optimistic 변경을 롤백하고 실패 토스트를 띄운다", async () => {
    const queryClient = createTestQueryClient();
    seedMember(queryClient);
    mockImmersiveReactEmoji.mockRejectedValue(new Error("failed"));
    const initialVote = makeVote();
    const { result } = renderUseImmersiveVote(queryClient, initialVote);

    act(() => result.current.handleEmojiClick("LIKE", { x: 10, y: 20 }));

    await waitFor(() => expect(showToast.warning).toHaveBeenCalledWith("이모지 반응에 실패했어요"));
    expect(result.current.vote.myEmoji).toBe(initialVote.myEmoji);
    expect(result.current.vote.emojiSummary).toEqual(initialVote.emojiSummary);
  });

  it("서버에서 VOTE_FREE_LIMIT_EXCEEDED 에러 반환 시 onLimit을 호출하고 실패 토스트는 띄우지 않는다", async () => {
    const queryClient = createTestQueryClient();
    seedGuest(queryClient, 5);
    const axiosError = new AxiosError("limit exceeded", undefined, undefined, undefined, {
      status: 400,
      data: { code: "VOTE_FREE_LIMIT_EXCEEDED" },
    } as never);
    mockImmersiveParticipate.mockRejectedValue(axiosError);
    const onLimit = vi.fn();
    const { result } = renderUseImmersiveVote(queryClient, makeVote(), onLimit);

    act(() => result.current.handleOptionClick(10));

    await waitFor(() => expect(onLimit).toHaveBeenCalledTimes(1));
    expect(showToast.warning).not.toHaveBeenCalled();
  });

  it("비회원 신규 투표 성공 시 잔여 횟수 토스트를 띄우고 캐시를 갱신한다", async () => {
    const queryClient = createTestQueryClient();
    seedGuest(queryClient, 5);
    mockImmersiveParticipate.mockResolvedValue({
      voteId: 101,
      action: "VOTED",
      selectedOptionId: 10,
      options: [
        { optionId: 10, label: "옵션 A", voteCount: 6, ratio: 60 },
        { optionId: 11, label: "옵션 B", voteCount: 4, ratio: 40 },
      ],
      remainingFreeVotes: 2,
    });
    const { result } = renderUseImmersiveVote(queryClient, makeVote());

    act(() => result.current.handleOptionClick(10));

    await waitFor(() => expect(showToast.info).toHaveBeenCalledWith("2회 남았어요"));
    const cached = queryClient.getQueryData<FreeVotesResponse>(["me", "free-votes"]);
    expect(cached?.remainingFreeVotes).toBe(2);
  });

  it("비회원이고 freeVotesData가 undefined(로딩 중)이면 API 호출 없이 조용히 차단한다", () => {
    const queryClient = createTestQueryClient();
    // freeVotesData를 시드하지 않아 undefined 상태 유지
    queryClient.setQueryData<null>(["user", "me"], null);
    const onLimit = vi.fn();
    const { result } = renderUseImmersiveVote(queryClient, makeVote(), onLimit);

    act(() => result.current.handleOptionClick(10));

    expect(mockImmersiveParticipate).not.toHaveBeenCalled();
    // undefined는 "0회"가 아니라 "로딩 중"이므로 한도 초과 모달을 띄우면 안 됨.
    expect(onLimit).not.toHaveBeenCalled();
  });
});
