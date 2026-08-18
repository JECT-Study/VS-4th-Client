import { API_BASE_URL } from "@base/api/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { postAllVotesClick, postHotTopicClick } from "./homeClickTracking.ts";

const mockFetch = () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("homeClickTracking", () => {
  it("핫토픽 클릭은 rank를 본문에 담아 보낸다", () => {
    const fetchMock = mockFetch();

    postHotTopicClick(12, 4);

    const [url, init] = fetchMock.mock.lastCall ?? [];
    expect(url).toBe(`${API_BASE_URL}/api/home/hot-topics/12/click`);
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ rank: 4 }));
    expect(init.headers).toEqual({ "Content-Type": "application/json" });
  });

  it("모든 투표 클릭은 본문 없이 보낸다", () => {
    const fetchMock = mockFetch();

    postAllVotesClick(7);

    const [url, init] = fetchMock.mock.lastCall ?? [];
    expect(url).toBe(`${API_BASE_URL}/api/home/votes/7/click`);
    expect(init.body).toBeUndefined();
  });

  // 쿠키가 안 실리면 204로 성공하면서 모든 클릭이 새 익명 사용자로 집계된다.
  // 전환이 빠를 때 요청이 취소되지 않으려면 keepalive도 필요하다.
  it("쿠키를 싣고 라우팅 중에도 살아남도록 보낸다", () => {
    const fetchMock = mockFetch();

    postHotTopicClick(1, 1);
    postAllVotesClick(2);

    for (const [, init] of fetchMock.mock.calls) {
      expect(init.credentials).toBe("include");
      expect(init.keepalive).toBe(true);
    }
  });

  it("요청이 실패해도 예외를 던지지 않는다", () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    expect(() => postHotTopicClick(1, 1)).not.toThrow();
  });
});
