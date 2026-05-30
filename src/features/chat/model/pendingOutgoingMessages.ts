// 전송 중인 메시지 content를 추적합니다.
// WebSocket 브로드캐스트가 isMine: false 로 도착하더라도 건너뛰고
// onSuccess의 낙관적 업데이트 결과를 그대로 유지하기 위해 사용합니다.
// 동일 content를 빠르게 여러 번 보낼 경우를 위해 count 기반 multiset으로 관리합니다.
const pending = new Map<number, Map<string, number>>();

export const addPending = (voteId: number, content: string) => {
  if (!pending.has(voteId)) pending.set(voteId, new Map());
  const map = pending.get(voteId)!;
  map.set(content, (map.get(content) ?? 0) + 1);
};

export const consumePending = (voteId: number, content: string): boolean => {
  const map = pending.get(voteId);
  const count = map?.get(content) ?? 0;
  if (count <= 0) return false;
  count === 1 ? map!.delete(content) : map!.set(content, count - 1);
  return true;
};
