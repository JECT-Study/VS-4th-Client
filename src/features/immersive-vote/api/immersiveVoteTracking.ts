import { API_BASE_URL, apiClient } from "@base/api/client";

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
const track = (path: string, body: unknown, options?: TrackOptions): void => {
  // axios(XHR)는 unload 중에 취소되므로 이탈 시점 전송만 keepalive fetch로 우회한다.
  // 인증이 쿠키 기반이라 credentials만 맞추면 apiClient와 동일하게 나간다.
  if (options?.keepalive && typeof fetch === "function") {
    fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
    return;
  }

  apiClient.post(path, body).catch(() => {});
};

export const postImmersiveImpression = (voteId: number, body: ImmersiveImpressionRequest): void =>
  track(`/api/immersive-votes/${voteId}/impression`, body);

export const postImmersiveFirstAction = (
  voteId: number,
  body: ImmersiveFirstActionRequest,
  options?: TrackOptions,
): void => track(`/api/immersive-votes/${voteId}/first-action`, body, options);
