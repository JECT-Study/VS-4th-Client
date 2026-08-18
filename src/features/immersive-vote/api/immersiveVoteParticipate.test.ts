import { afterEach, describe, expect, it, vi } from "vitest";
import {
  beginImmersiveExposure,
  confirmImmersiveImpression,
  getImmersiveImpressionContext,
  resetImmersiveImpressions,
} from "../model/immersiveImpression";
import { immersiveParticipate } from "./immersiveVoteParticipate";

const mockPost = vi.fn();

vi.mock("@base/api/client", () => ({
  API_BASE_URL: "",
  apiClient: { post: (...args: unknown[]) => mockPost(...args) },
}));

vi.mock("./immersiveVoteTracking", () => ({
  postImmersiveImpression: vi.fn(),
  postImmersiveFirstAction: vi.fn(),
}));

const VOTE_ID = 7;
const OPTION_ID = 12;

/** 노출 판정(50% 이상 · 1초 이상)을 통과한 상태. */
const exposeAndConfirm = () => {
  beginImmersiveExposure(VOTE_ID, 0);
  confirmImmersiveImpression(VOTE_ID);
};

const requestBody = (index: number) =>
  mockPost.mock.calls[index]?.[1] as { optionId: number; impressionId?: string; elapsedMs?: number };

describe("immersiveParticipate", () => {
  afterEach(() => {
    resetImmersiveImpressions();
    vi.clearAllMocks();
  });

  it("첫 투표에만 노출 정보를 싣고 뒤이은 취소·재투표에는 싣지 않는다", async () => {
    exposeAndConfirm();
    mockPost.mockResolvedValue({ data: {} });

    await immersiveParticipate(VOTE_ID, OPTION_ID);
    await immersiveParticipate(VOTE_ID, OPTION_ID);

    expect(requestBody(0)).toEqual({
      optionId: OPTION_ID,
      impressionId: expect.any(String),
      elapsedMs: expect.any(Number),
    });
    expect(requestBody(1)).toEqual({ optionId: OPTION_ID });
  });

  it("노출 정보를 실은 요청이 실패하면 재시도가 다시 실을 수 있다", async () => {
    exposeAndConfirm();
    mockPost.mockRejectedValueOnce(new Error("network"));

    await expect(immersiveParticipate(VOTE_ID, OPTION_ID)).rejects.toThrow("network");

    expect(getImmersiveImpressionContext(VOTE_ID).impressionId).toEqual(expect.any(String));
  });

  it("빈 채로 나간 취소 요청이 실패해도 이미 집계된 노출을 다시 열지 않는다", async () => {
    exposeAndConfirm();
    mockPost.mockResolvedValueOnce({ data: {} });
    await immersiveParticipate(VOTE_ID, OPTION_ID);

    mockPost.mockRejectedValueOnce(new Error("network"));
    await expect(immersiveParticipate(VOTE_ID, OPTION_ID)).rejects.toThrow("network");

    mockPost.mockResolvedValueOnce({ data: {} });
    await immersiveParticipate(VOTE_ID, OPTION_ID);

    expect(requestBody(2)).toEqual({ optionId: OPTION_ID });
  });
});
