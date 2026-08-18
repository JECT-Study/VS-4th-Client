# 몰입형 A/B 계측 — 프론트 연동

호출할 API 3개. 전부 `credentials: 'include'` 필수, 응답은 `204 No Content`.

---

## 1. 노출 (신규)

콘텐츠가 화면에 보이기 시작할 때 1회.

```
POST /api/immersive-votes/{voteId}/impression
```

```json
{
  "impressionId": "8f14e45f-ceea-467a-9f0b-1c1e0b2d3a4b",
  "position": 3
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `impressionId` | string | ✅ | 노출마다 `crypto.randomUUID()`로 새로 발급. 최대 64자 |
| `position` | int | | 피드 내 순서 (0부터) |

---

## 2. 첫 행동 (신규)

그 노출에서 **가장 먼저** 한 행동 1회만. 두 번째 행동부터는 안 보냄.

```
POST /api/immersive-votes/{voteId}/first-action
```

```json
{
  "impressionId": "8f14e45f-ceea-467a-9f0b-1c1e0b2d3a4b",
  "action": "EMOJI",
  "elapsedMs": 4200
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `impressionId` | string | ✅ | 1번에서 발급한 값 그대로 |
| `action` | enum | ✅ | 아래 6개 중 하나 |
| `elapsedMs` | int | | 노출 → 행동까지 걸린 ms |

**action 값**

| 값 | 언제 |
|---|---|
| `VOTE` | 투표 옵션 선택 |
| `CHAT` | 채팅 입력·전송 |
| `EMOJI` | 이모지 반응 |
| `SHARE` | 공유하기 |
| `EXPAND` | 본문 펼치기 |
| `SCROLL_NEXT` | 아무것도 안 누르고 다음 콘텐츠로 스와이프 |

> 아무 인터랙션 없이 이탈한 경우 **호출하지 않음.**

---

## 3. 투표 (기존 API에 필드 2개 추가)

```
POST /api/immersive-votes/{voteId}/participate
```

```json
{
  "optionId": 12,
  "impressionId": "8f14e45f-ceea-467a-9f0b-1c1e0b2d3a4b",
  "elapsedMs": 4200
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `optionId` | int | ✅ | 기존과 동일 |
| `impressionId` | string | | **추가** |
| `elapsedMs` | int | | **추가** — 노출 → 투표까지 걸린 ms |

둘 다 선택값이라 기존 호출은 그대로 동작함.

---

## 규칙

- **시간은 `performance.now()`로 측정.** `Date.now()` 쓰지 말 것
- **노출 판정: 뷰포트 50% 이상 + 1초 이상 연속.** A안·B안 동일 기준 적용
- **같은 콘텐츠 다시 보면 `impressionId` 새로 발급**
- **투표가 첫 행동이면 2번·3번 둘 다 호출**
- **`variant`는 보내지 말 것.** 서버가 결정함
- **호출 실패는 무시.** `.catch(() => {})`

---

## 참고 코드

```js
const impressions = new Map();

function track(url, body) {
  fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
}

// 뷰포트 50% · 1초 이상 노출됐을 때
function onShown(voteId, position) {
  const impressionId = crypto.randomUUID();
  impressions.set(voteId, {
    impressionId,
    shownAt: performance.now(),
    firstActionSent: false,
  });
  track(`/api/immersive-votes/${voteId}/impression`, { impressionId, position });
}

function elapsedOf(voteId) {
  const s = impressions.get(voteId);
  return s ? Math.round(performance.now() - s.shownAt) : undefined;
}

// 투표·채팅·이모지·공유·펼치기·다음스와이프 핸들러 맨 앞에서 호출
function onFirstAction(voteId, action) {
  const s = impressions.get(voteId);
  if (!s || s.firstActionSent) return;
  s.firstActionSent = true;
  track(`/api/immersive-votes/${voteId}/first-action`, {
    impressionId: s.impressionId,
    action,
    elapsedMs: elapsedOf(voteId),
  });
}

async function vote(voteId, optionId) {
  onFirstAction(voteId, 'VOTE');
  const s = impressions.get(voteId);
  return fetch(`/api/immersive-votes/${voteId}/participate`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      optionId,
      impressionId: s?.impressionId,
      elapsedMs: elapsedOf(voteId),
    }),
  });
}
```

---

## 체크리스트

- [ ] 콘텐츠 노출 시 `/impression` 정확히 1회 (빠른 스와이프는 호출 안 됨)
- [ ] 첫 행동 1회 이후 `/first-action` 추가 호출 없음
- [ ] 투표 시 `/first-action`(첫 행동일 때만) + `/participate` 둘 다 나감
- [ ] 세 호출의 `impressionId`가 서로 같음
- [ ] 되돌아가 다시 본 콘텐츠는 `impressionId` 새로 발급
- [ ] 모든 요청에 `credentials: 'include'`
- [ ] `elapsedMs`가 항상 0 이상
- [ ] 무인터랙션 이탈 시 `/first-action` 호출 안 함
