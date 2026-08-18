import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ImmersiveFirstActionRequest, ImmersiveImpressionRequest } from "../api/immersiveVoteTracking";
import {
  beginImmersiveExposure,
  confirmImmersiveImpression,
  endImmersiveExposure,
  getImmersiveImpressionContext,
  markImmersiveBackground,
  markImmersiveForeground,
  releaseImmersiveParticipateContext,
  resetImmersiveImpressions,
  trackImmersiveFirstAction,
  trackImmersiveLeave,
} from "./immersiveImpression";

const mockPostImmersiveImpression = vi.fn();
const mockPostImmersiveFirstAction = vi.fn();

vi.mock("../api/immersiveVoteTracking", () => ({
  postImmersiveImpression: (...args: unknown[]) => mockPostImmersiveImpression(...args),
  postImmersiveFirstAction: (...args: unknown[]) => mockPostImmersiveFirstAction(...args),
}));

const VOTE_ID = 101;
const OTHER_VOTE_ID = 202;

// mock.calls는 인덱스 접근이 optional로 잡혀서 본문이 장황해지므로 읽기 헬퍼로 감싼다.
const impressionBody = (index: number) =>
  mockPostImmersiveImpression.mock.calls[index]?.[1] as ImmersiveImpressionRequest;
const firstActionVoteId = (index: number) => mockPostImmersiveFirstAction.mock.calls[index]?.[0] as number;
const firstActionBody = (index: number) =>
  mockPostImmersiveFirstAction.mock.calls[index]?.[1] as ImmersiveFirstActionRequest;
const firstActionOptions = (index: number) =>
  mockPostImmersiveFirstAction.mock.calls[index]?.[2] as { keepalive?: boolean } | undefined;

/** 노출 판정(50% 이상 · 1초 이상)을 통과한 상태. */
const exposeAndConfirm = (voteId: number, position = 0) => {
  beginImmersiveExposure(voteId, position);
  confirmImmersiveImpression(voteId);
};

describe("immersiveImpression", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetImmersiveImpressions();
    vi.clearAllMocks();
  });

  describe("노출", () => {
    it("1초를 채워야 노출을 보낸다", () => {
      beginImmersiveExposure(VOTE_ID, 3);
      expect(mockPostImmersiveImpression).not.toHaveBeenCalled();

      confirmImmersiveImpression(VOTE_ID);

      expect(mockPostImmersiveImpression).toHaveBeenCalledTimes(1);
      expect(mockPostImmersiveImpression).toHaveBeenCalledWith(VOTE_ID, {
        impressionId: expect.any(String),
        position: 3,
      });
    });

    it("빠르게 스쳐 지나간 카드는 노출로 잡지 않는다", () => {
      beginImmersiveExposure(VOTE_ID, 0);
      endImmersiveExposure(VOTE_ID);
      trackImmersiveLeave(VOTE_ID);

      expect(mockPostImmersiveImpression).not.toHaveBeenCalled();
      expect(mockPostImmersiveFirstAction).not.toHaveBeenCalled();
    });

    it("같은 투표를 다시 보면 impressionId를 새로 발급한다", () => {
      exposeAndConfirm(VOTE_ID);
      endImmersiveExposure(VOTE_ID);
      vi.advanceTimersByTime(1000);

      exposeAndConfirm(VOTE_ID);

      expect(impressionBody(1).impressionId).not.toBe(impressionBody(0).impressionId);
    });

    it("캐러셀 되감기로 노출이 잠깐 끊겨도 같은 노출로 이어 붙인다", () => {
      exposeAndConfirm(VOTE_ID);

      // 마지막 카드에서 첫 카드로 되감기는 순간: 같은 투표의 두 벌이 교체된다.
      beginImmersiveExposure(VOTE_ID, 0);
      endImmersiveExposure(VOTE_ID);
      confirmImmersiveImpression(VOTE_ID);

      expect(mockPostImmersiveImpression).toHaveBeenCalledTimes(1);
    });
  });

  describe("첫 행동", () => {
    it("한 노출에서 가장 먼저 한 행동만 기록한다", () => {
      exposeAndConfirm(VOTE_ID);

      trackImmersiveFirstAction(VOTE_ID, "EMOJI");
      trackImmersiveFirstAction(VOTE_ID, "CHAT");
      trackImmersiveFirstAction(VOTE_ID, "VOTE");

      expect(mockPostImmersiveFirstAction).toHaveBeenCalledTimes(1);
      expect(firstActionBody(0)).toEqual({
        impressionId: expect.any(String),
        action: "EMOJI",
        elapsedMs: expect.any(Number),
      });
    });

    it("1초를 채우기 전에 행동하면 노출을 먼저 확정하고 함께 기록한다", () => {
      beginImmersiveExposure(VOTE_ID, 0);
      trackImmersiveFirstAction(VOTE_ID, "VOTE");

      expect(mockPostImmersiveImpression).toHaveBeenCalledTimes(1);
      expect(firstActionBody(0).action).toBe("VOTE");
      expect(firstActionBody(0).impressionId).toBe(impressionBody(0).impressionId);
    });

    it("노출 전의 행동은 보내지 않는다", () => {
      trackImmersiveFirstAction(VOTE_ID, "VOTE");

      expect(mockPostImmersiveFirstAction).not.toHaveBeenCalled();
    });

    it("다시 노출되면 그 노출의 첫 행동을 새로 기록한다", () => {
      exposeAndConfirm(VOTE_ID);
      trackImmersiveFirstAction(VOTE_ID, "EMOJI");

      endImmersiveExposure(VOTE_ID);
      vi.advanceTimersByTime(1000);
      exposeAndConfirm(VOTE_ID);
      trackImmersiveFirstAction(VOTE_ID, "CHAT");

      expect(mockPostImmersiveFirstAction).toHaveBeenCalledTimes(2);
      expect(firstActionBody(1).action).toBe("CHAT");
    });

    it("투표별로 독립적으로 기록한다", () => {
      exposeAndConfirm(VOTE_ID, 0);
      exposeAndConfirm(OTHER_VOTE_ID, 1);

      trackImmersiveFirstAction(VOTE_ID, "EMOJI");
      trackImmersiveLeave(OTHER_VOTE_ID);

      expect(mockPostImmersiveFirstAction).toHaveBeenCalledTimes(2);
      expect(firstActionVoteId(0)).toBe(VOTE_ID);
      expect(firstActionVoteId(1)).toBe(OTHER_VOTE_ID);
    });

    it("elapsedMs는 항상 0 이상이다", () => {
      exposeAndConfirm(VOTE_ID);
      trackImmersiveFirstAction(VOTE_ID, "VOTE");

      expect(firstActionBody(0).elapsedMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe("이탈", () => {
    it("아무 행동 없이 떠나면 이탈로 기록한다", () => {
      exposeAndConfirm(VOTE_ID);
      trackImmersiveLeave(VOTE_ID);

      expect(mockPostImmersiveFirstAction).toHaveBeenCalledTimes(1);
      expect(firstActionBody(0).action).toBe("SCROLL_NEXT");
    });

    it("이미 다른 행동을 했으면 이탈로 덮어쓰지 않는다", () => {
      exposeAndConfirm(VOTE_ID);
      trackImmersiveFirstAction(VOTE_ID, "EXPAND");
      trackImmersiveLeave(VOTE_ID);

      expect(mockPostImmersiveFirstAction).toHaveBeenCalledTimes(1);
      expect(firstActionBody(0).action).toBe("EXPAND");
    });

    it("페이지가 사라지는 중이면 keepalive로 보낸다", () => {
      exposeAndConfirm(VOTE_ID);
      trackImmersiveLeave(VOTE_ID, { keepalive: true });

      expect(firstActionOptions(0)).toEqual({ keepalive: true });
    });

    it("이탈은 한 번만 나간다", () => {
      exposeAndConfirm(VOTE_ID);
      trackImmersiveLeave(VOTE_ID);
      trackImmersiveLeave(VOTE_ID, { keepalive: true });

      expect(mockPostImmersiveFirstAction).toHaveBeenCalledTimes(1);
    });
  });

  describe("투표 요청에 실을 노출 정보", () => {
    it("노출·첫 행동과 같은 impressionId를 돌려준다", () => {
      exposeAndConfirm(VOTE_ID);
      trackImmersiveFirstAction(VOTE_ID, "VOTE");

      expect(getImmersiveImpressionContext(VOTE_ID)).toEqual({
        impressionId: impressionBody(0).impressionId,
        elapsedMs: expect.any(Number),
      });
      expect(firstActionBody(0).impressionId).toBe(impressionBody(0).impressionId);
    });

    it("취소·재투표에는 노출 정보를 싣지 않는다", () => {
      exposeAndConfirm(VOTE_ID);

      expect(getImmersiveImpressionContext(VOTE_ID).impressionId).toEqual(expect.any(String));
      expect(getImmersiveImpressionContext(VOTE_ID)).toEqual({});
    });

    it("투표가 실패하면 재시도가 노출 정보를 다시 실을 수 있다", () => {
      exposeAndConfirm(VOTE_ID);
      const first = getImmersiveImpressionContext(VOTE_ID);

      releaseImmersiveParticipateContext(VOTE_ID);

      expect(getImmersiveImpressionContext(VOTE_ID).impressionId).toBe(first.impressionId);
    });

    it("노출 전이면 빈 객체를 돌려줘 필드가 빠진 채 나가게 한다", () => {
      expect(getImmersiveImpressionContext(VOTE_ID)).toEqual({});
    });

    it("피드를 떠난 뒤에는 옛 노출 정보를 재사용하지 않는다", () => {
      exposeAndConfirm(VOTE_ID);
      resetImmersiveImpressions();

      expect(getImmersiveImpressionContext(VOTE_ID)).toEqual({});
    });
  });

  describe("백그라운드 체류 시간", () => {
    it("탭이 내려가 있던 시간은 elapsedMs에서 뺀다", () => {
      exposeAndConfirm(VOTE_ID);

      vi.advanceTimersByTime(2_000);
      markImmersiveBackground();
      vi.advanceTimersByTime(60_000);
      markImmersiveForeground();
      vi.advanceTimersByTime(1_000);

      trackImmersiveFirstAction(VOTE_ID, "VOTE");

      // 실제로 본 시간은 3초. 백그라운드 60초는 빠져야 한다.
      expect(firstActionBody(0).elapsedMs).toBe(3_000);
    });

    it("백그라운드에서 뒤늦게 도착한 노출 타이머는 무시한다", () => {
      beginImmersiveExposure(VOTE_ID, 0);
      markImmersiveBackground();
      confirmImmersiveImpression(VOTE_ID);

      expect(mockPostImmersiveImpression).not.toHaveBeenCalled();
    });
  });
});
