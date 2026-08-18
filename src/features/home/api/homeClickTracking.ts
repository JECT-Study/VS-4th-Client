import { API_BASE_URL } from "@base/api/client";

/** 핫토픽 응답의 rank 값. 1~3위는 캐러셀, 4~5위는 리스트로 서버가 나눈다. */
export interface HotTopicClickRequest {
  rank: number;
}

// 계측은 사용자 경험에 영향을 주면 안 되므로 실패를 전부 삼키고 응답을 기다리지 않는다.
//
// apiClient를 쓰지 않는 이유가 두 가지다.
// 1. 401 응답이 인터셉터의 토큰 재발급을 태우고, 재발급까지 실패하면 세션 만료 토스트와
//    /login 리다이렉트가 일어난다. 사용자가 아무것도 누르지 않았는데 화면이 튀면 안 된다.
// 2. 클릭 직후 라우팅이라 axios(XHR)는 전환이 빠를 때 취소된다. keepalive로 넘겨야 한다.
//
// credentials를 빠뜨리면 204로 성공하고 화면상 이상이 없는데 쿠키가 안 실려서
// 로그인 사용자가 전부 비회원으로, 매 클릭이 새 익명 사용자로 집계된다.
const track = (path: string, body?: unknown): void => {
  if (typeof fetch !== "function") return;

  fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
};

/** 핫토픽 카드 탭. 캐러셀(1~3위)·리스트(4~5위) 공통이며 rank로 서버가 이벤트를 나눈다. */
export const postHotTopicClick = (voteId: number, rank: number): void =>
  track(`/api/home/hot-topics/${voteId}/click`, { rank } satisfies HotTopicClickRequest);

/** '모든 투표' 리스트 카드 탭. */
export const postAllVotesClick = (voteId: number): void => track(`/api/home/votes/${voteId}/click`);
