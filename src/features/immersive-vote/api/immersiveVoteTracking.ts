import { API_BASE_URL } from "@base/api/client";

/** 한 노출에서 사용자가 가장 먼저 한 행동. */
export type ImmersiveFirstAction = "VOTE" | "CHAT" | "EMOJI" | "SHARE" | "EXPAND" | "SCROLL_NEXT";

export interface ImmersiveImpressionRequest {
  impressionId: string;
  position?: number;
}

export interface ImmersiveFirstActionRequest {
  impressionId: string;
  action: ImmersiveFirstAction;
  elapsedMs?: number;
}

export interface TrackOptions {
  /** 페이지가 사라지는 중이라 응답을 기다릴 수 없을 때. 브라우저가 요청만 넘겨받아 마저 보낸다. */
  keepalive?: boolean;
}

// 계측은 사용자 경험에 영향을 주면 안 되므로 실패를 전부 삼키고 대기하지 않는다.
//
// apiClient를 쓰지 않는 이유가 두 가지다.
// 1. 401 응답이 인터셉터의 토큰 재발급을 태우고, 재발급까지 실패하면 세션 만료 토스트와
//    /login 리다이렉트가 일어난다. 사용자가 아무것도 누르지 않았는데 화면이 튀면 안 된다.
// 2. axios(XHR)는 unload 중에 취소돼서 이탈 시점 전송이 통째로 유실된다.
// 인증이 쿠키 기반이라 credentials만 맞추면 apiClient와 동일하게 나간다.
const track = (path: string, body: unknown, options?: TrackOptions): void => {
  if (typeof fetch !== "function") return;

  fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: options?.keepalive,
  }).catch(() => {});
};

export const postImmersiveImpression = (voteId: number, body: ImmersiveImpressionRequest): void =>
  track(`/api/immersive-votes/${voteId}/impression`, body);

export const postImmersiveFirstAction = (
  voteId: number,
  body: ImmersiveFirstActionRequest,
  options?: TrackOptions,
): void => track(`/api/immersive-votes/${voteId}/first-action`, body, options);
