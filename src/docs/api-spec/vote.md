# REST API — 일반형 투표

## GET /api/votes/{voteId} — 투표 상세

| **구분** | **파라미터** | **타입** | **필수** | **설명** |
| --- | --- | --- | --- | --- |
| Path | `voteId` | `Long` | ✅ | 투표 ID |

### Response (회원 - 투표 전)

```json
{
  "voteId": 1,
  "title": "직장인 점심시간 혼밥 vs 같이 먹기",
  "createdAt": "2026-04-14T13:49:00+09:00",
  "content": "저는 혼자 밥 먹는 게 편한데 회사라서 막내라 혼자 밥 먹겠다고 하기 눈치보여요ㅠㅠ 혼밥하고 싶다고 말씀드려도 될까요?",
  "thumbnailUrl": "https://cdn.example.com/votes/1/thumb.jpg",
  "status": "ONGOING",
  "endAt": "2026-04-14T23:59:00+09:00",
  "participantCount": 31,
  "options": [
    { "optionId": 10, "label": "혼밥이 편하다", "voteCount": null, "ratio": null },
    { "optionId": 11, "label": "그래도 밥은 같이 먹는 게 맞다", "voteCount": null, "ratio": null }
  ],
  "myVote": {
    "voted": false,
    "selectedOptionId": null
  },
  "emojiSummary": {
    "LIKE": 21,
    "SAD": 3,
    "ANGRY": 8,
    "WOW": 36
  },
  "myEmoji": null,
  "commentCount": 81
}
```

### Response (회원 - 투표 후)

```json
{
  "voteId": 1,
  "title": "직장인 점심시간 혼밥 vs 같이 먹기",
  "createdAt": "2026-04-14T13:49:00+09:00",
  "content": "...",
  "thumbnailUrl": "https://cdn.example.com/votes/1/thumb.jpg",
  "status": "ONGOING",
  "endAt": "2026-04-14T23:59:00+09:00",
  "participantCount": 31,
  "options": [
    { "optionId": 10, "label": "혼밥이 편하다", "voteCount": 22, "ratio": 70 },
    { "optionId": 11, "label": "그래도 밥은 같이 먹는 게 맞다", "voteCount": 9, "ratio": 30 }
  ],
  "myVote": {
    "voted": true,
    "selectedOptionId": 10
  },
  "emojiSummary": {
    "LIKE": 21,
    "SAD": 3,
    "ANGRY": 8,
    "WOW": 36
  },
  "myEmoji": "WOW",
  "commentCount": 81
}
```

> 💡 `myVote.voted = false`일 때는 `voteCount`/`ratio`를 `null`로 내려서 결과 비공개. 프론트는 옵션 버튼 형태로 노출. 
`myVote.voted = true`일 때만 결과 표시. 다시투표하기 버튼은 프론트에서 `voted` 기준으로 분기.

> `status`는 `ONGOING`, `ENDED` 두 개입니다. - `ONGOING` : 진행 중 (`now() < endAt`) - `ENDED` : 종료됨 (`now() ≥ endAt`)

> 📌 비회원도 동일 응답. 
단 `myVote.voted`는 비회원 무료 투표권으로 투표한 경우 `true`로 응답하며 
5회 소진 정책은 별도 API로 관리. `GET /api/me/free-votes`

## POST /api/votes/{voteId}/participate — 투표 참여

| **구분** | **파라미터** | **타입** | **필수** | **설명** |
| --- | --- | --- | --- | --- |
| Path | `voteId` | `Long` | ✅ | 투표 ID |
| Body | `optionId` | `Long` | ✅ | 선택한 옵션 ID |

### Request Body

```json
{ "optionId": 10 }
```

### Response

```json
{
  "voteId": 1,
  "selectedOptionId": 10,
  "options": [
    { "optionId": 10, "label": "혼밥이 편하다", "voteCount": 22, "ratio": 70 },
    { "optionId": 11, "label": "그래도 밥은 같이 먹는 게 맞다", "voteCount": 9, "ratio": 30 }
  ],
  "participantCount": 31,
  "remainingFreeVotes": 4
}
```

> 💡 `remainingFreeVotes`는 비회원에게만 의미 있는 값. 회원은 `null`
> 

> 📌 비회원이 5회 소진 후 추가 시도 시 `403 VOTE_FREE_LIMIT_EXCEEDED` 응답
> 

## DELETE /api/votes/{voteId}/participate — 다시투표하기 (투표 취소)

| **구분** | **파라미터** | **타입** | **필수** | **설명** |
| --- | --- | --- | --- | --- |
| Path | `voteId` | `Long` | ✅ | 투표 ID |

### Response

`204 No Content`

> 💡 투표 결과 화면에서 `다시투표하기` 클릭 시 호출. 
호출 후 프론트는 `GET /api/votes/{voteId}` 재조회하여 옵션 선택 상태로 복귀.
> 

## PUT /api/votes/{voteId}/emoji — 이모지 반응

| **구분** | **파라미터** | **타입** | **필수** | **설명** |
| --- | --- | --- | --- | --- |
| Path | `voteId` | `Long` | ✅ | 투표 ID |
| Body | `emoji` | `LIKE | SAD | ANGRY | WOW | null` | ✅ | 선택한 이모지. `null`이면 선택 취소 |

### Request Body

```json
{ "emoji": "WOW" }
```

### Response

```json
{
  "emojiSummary": {
    "LIKE": 21,
    "SAD": 3,
    "ANGRY": 8,
    "WOW": 37
    "total": 132
  },
  "myEmoji": "WOW"
}
```

> 💡 이모지는 1인 1개만 가능. 다른 이모지 선택 시 기존 반응 자동 교체. 
같은 이모지 재선택 또는 `emoji: null` 전송 시 반응 취소.

> 📌 회원/비회원 모두 호출 가능. 비회원은 쿠키 기반 식별.

---

# REST API — 투표 결과 (마감 후)

## GET /api/votes/{voteId}/result — 투표 결과

| **구분** | **파라미터** | **타입** | **필수** | **설명** |
| --- | --- | --- | --- | --- |
| Path | `voteId` | `Long` | ✅ | 투표 ID |

### Response (회원 - 참여O)

```json
{
  "voteId": 1,
  "title": "직장인 점심시간 혼밥 vs 같이 먹기",
  "createdAt": "2026-04-14T13:49:00+09:00",
  "content": "저는 혼자 밥 먹는 게 편한데 회사라서 막내라 혼자 밥 먹겠다고 하기 눈치보여요ㅠㅠ...",
  "thumbnailUrl": "https://cdn.example.com/votes/1/thumb.jpg",
  "status": "ENDED",
  "endAt": "2026-04-14T23:59:00+09:00",
  "participantCount": 520,
  "result": {
    "options": [
      { "optionId": 10, "label": "혼밥이 편하다", "voteCount": 364, "ratio": 70 },
      { "optionId": 11, "label": "그래도 밥은 같이 먹는 게 맞다", "voteCount": 156, "ratio": 30 }
    ]
  },
  "myVote": {
    "voted": true,
    "selectedOptionId": 11
  },
  "insight": {
    "locked": false,
    "scope": "MY_SELECTION",
    "selectionCount": 156,
    "genderDistribution": {
      "female": { "count": 96, "ratio": 62 },
      "male":   { "count": 60, "ratio": 38 }
    },
    "ageDistribution": [
      { "ageGroup": "20s", "ratio": 28, "isMyGroup": true },
      { "ageGroup": "30s", "ratio": 52, "isMyGroup": false },
      { "ageGroup": "40s", "ratio": 20, "isMyGroup": false }
    ]
  },
  "aiInsight": {
    "available": true,
    "headline": "20대 여성 그룹에서 \"같이 밥먹기\"를 선택한 비율이 71%로 가장 높게 나타났어요.",
    "body": "MZ 세대를 중심으로 혼밥 문화가 확산되는 트렌드가 반영된 결과예요."
  }
}
```

### Response (회원 - 참여X)

```json
{
  "voteId": 1,
  "title": "직장인 점심시간 혼밥 vs 같이 먹기",
  "createdAt": "2026-04-14T13:49:00+09:00",
  "content": "...",
  "thumbnailUrl": "https://cdn.example.com/votes/1/thumb.jpg",
  "status": "ENDED",
  "endAt": "2026-04-14T23:59:00+09:00",
  "participantCount": 520,
  "result": {
    "options": [
      { "optionId": 10, "label": "혼밥이 편하다", "voteCount": 364, "ratio": 70 },
      { "optionId": 11, "label": "그래도 밥은 같이 먹는 게 맞다", "voteCount": 156, "ratio": 30 }
    ]
  },
  "myVote": {
    "voted": false,
    "selectedOptionId": null
  },
  "insight": {
    "locked": false,
    "scope": "TOTAL",
    "selectionCount": 364,
    "genderDistribution": {
      "female": { "count": 225, "ratio": 62 },
      "male":   { "count": 139, "ratio": 38 }
    },
    "ageDistribution": [
      { "ageGroup": "20s", "ratio": 28, "isMyGroup": false },
      { "ageGroup": "30s", "ratio": 52, "isMyGroup": false },
      { "ageGroup": "40s", "ratio": 20, "isMyGroup": false }
    ]
  },
  "aiInsight": {
    "available": false,
    "headline": null,
    "body": null
  }
}
```

### Response (비회원)

```json
{
  "voteId": 1,
  "title": "직장인 점심시간 혼밥 vs 같이 먹기",
  "createdAt": "2026-04-14T13:49:00+09:00",
  "content": "...",
  "thumbnailUrl": "https://cdn.example.com/votes/1/thumb.jpg",
  "status": "ENDED",
  "endAt": "2026-04-14T23:59:00+09:00",
  "participantCount": 520,
  "result": {
    "options": [
      { "optionId": 10, "label": "혼밥이 편하다", "voteCount": 364, "ratio": 70 },
      { "optionId": 11, "label": "그래도 밥은 같이 먹는 게 맞다", "voteCount": 156, "ratio": 30 }
    ]
  },
  "myVote": {
    "voted": false,
    "selectedOptionId": null
  },
  "insight": {
    "locked": true,
    "scope": null,
    "selectionCount": null,
    "genderDistribution": null,
    "ageDistribution": null
  },
  "aiInsight": {
    "available": false,
    "headline": null,
    "body": null
  }
}
```

> 💡 `insight.scope` 분기 규칙 — 
`MY_SELECTION`: 회원 + 참여O → 본인이 선택한 옵션 기준 분석, 본인 연령대(`isMyGroup: true`) 강조. 
`TOTAL`: 회원 + 참여X → 전체 참여자 기준 분석, 다수 선택 옵션을 컬러 강조 (프론트가 `result.options` 비교해서 처리). 
`null` + `locked: true`: 비회원 → 잠금 컴포넌트 노출.

> 📌 `aiInsight.available`은 회원+참여O일 때만 `true` 가능

> 💡 `status: ONGOING`인 voteId로 호출 시 `403 VOTE_NOT_ENDED` 응답. 
진행 중 투표는 `GET /api/votes/{voteId}`로만 조회.

## GET /api/votes/{voteId}/share — 공유 링크 생성

| **구분** | **파라미터** | **타입** | **필수** | **설명** |
| --- | --- | --- | --- | --- |
| Path | `voteId` | `Long` | ✅ | 투표 ID |

### Response

```json
{
  "shareUrl": "https://vs.app/poll/result/12345",
  "title": "직장인 점심시간 혼밥 vs 같이 먹기",
  "thumbnailUrl": "https://cdn.example.com/votes/1/thumb.jpg"
}
```

> 💡 공유하기 버튼 → 팝업 노출 시 호출. 프론트는 `shareUrl`을 클립보드 복사 후 토스트 노출. 
공유 링크로 진입한 비회원도 `GET /api/votes/{voteId}/result` 호출하여 잠금 상태로 결과 확인 가능.

---

# REST API — 알림

## GET /api/notifications — 알림 목록

| **구분** | **파라미터** | **타입** | **필수** | **설명** |
| --- | --- | --- | --- | --- |
| Query | `cursor` | `Long` | ❌ | 이전 페이지 마지막 notificationId |
| Query | `size` | `Int` | ❌ | 페이지 크기 (기본 20) |

### Response

```json
{
  "notifications": [
    {
      "notificationId": 9001,
      "type": "VOTE_ENDED",
      "voteId": 1,
      "title": "투표 결과가 공개됐어요",
      "body": "[직장인 점심, 혼밥 VS 같이먹기] 결과 보러가기",
      "isRead": false,
      "createdAt": "2026-04-14T17:00:00+09:00"
    }
  ],
  "nextCursor": 8980,
  "hasNext": true
}
```

> 📌 알림 리스트 항목 클릭 시 프론트는 `voteId` 기반으로 결과 화면(`/api/votes/{voteId}/result`) 진입.

## POST /api/notifications/{notificationId}/read — 알림 읽음 처리

| **구분** | **파라미터** | **타입** | **필수** | **설명** |
| --- | --- | --- | --- | --- |
| Path | `notificationId` | `Long` | ✅ | 알림 ID |

### Response

`204 No Content`

## POST /api/devices/push-token — PUSH 토큰 등록

| **구분** | **파라미터** | **타입** | **필수** | **설명** |
| --- | --- | --- | --- | --- |
| Body | `token` | `String` | ✅ | FCM/APNs 디바이스 토큰 |
| Body | `platform` | `IOS | ANDROID` | ✅ | 플랫폼 |

### Request Body

```json
{
  "token": "fcm_xxxxxxxxxxxxxxxxxxxx",
  "platform": "IOS"
}
```

### Response

`204 No Content`

> 💡 투표 종료 시 PUSH 알림(`투표 결과가 공개됐어요`) 발송 대상 식별용. 회원이 투표 참여한 경우에만 발송.

---

# REST API — 몰입형 투표

## GET /api/immersive-votes — 몰입형 투표 피드

| **구분** | **파라미터** | **타입** | **필수** | **설명** |
| --- | --- | --- | --- | --- |
| Query | `cursor` | `Long` | ❌ | 이전 페이지 마지막 voteId. 없으면 최신부터 |
| Query | `size` | `Int` | ❌ | 페이지 크기 (기본값: 10) |

### Response

```json
{
  "votes": [
    {
      "voteId": 1,
      "title": "논쟁 끝판왕 밸런스게임",
      "content": "자기 전에 갑자기 생각난 밸런스 게임인데 한 번 골라봐. 친구들한테 물어봤는데도 의견이 엄청 갈리더라...",
      "imageUrl": "https://cdn.example.com/votes/1/main.jpg",
      "endAt": "2026-04-27T23:59:00+09:00",
      "options": [
        { "optionId": 10, "label": "스윙칩만 3달 먹기", "voteCount": null, "ratio": null },
        { "optionId": 11, "label": "스윙스한테 30만원 주기", "voteCount": null, "ratio": null }
      ],
      "myVote": {
        "voted": false,
        "selectedOptionId": null
      },
      "emojiSummary": {
        "LIKE": 21,
        "SAD": 3,
        "ANGRY": 8,
        "WOW": 36,
        "total": 131
      },
      "myEmoji": null,
      "commentCount": 27,
      "currentViewerCount": 13
    }
  ],
  "nextCursor": 980,
  "hasNext": true
}
```

> 📌 위/아래 스와이프로 다음 투표 이동 → 프론트는 `cursor` 기반 prefetch 권장 (현재 인덱스 기준 ±2개 미리 로딩). 
회원/비회원 동일 응답. 단 비회원이 5회 소진 후에도 피드 자체는 계속 조회 가능.

## POST /api/immersive-votes/{voteId}/participate — 투표 참여 / 취소

| **구분** | **파라미터** | **타입** | **필수** | **설명** |
| --- | --- | --- | --- | --- |
| Path | `voteId` | `Long` | ✅ | 투표 ID |
| Body | `optionId` | `Long` | ✅ | 선택할 옵션 ID. 이미 같은 옵션을 선택한 상태면 취소 처리 |

### Request Body

```json
{ "optionId": 10 }
```

### Response (참여 / 변경)

```json
{
  "voteId": 1,
  "action": "VOTED",
  "selectedOptionId": 10,
  "options": [
    { "optionId": 10, "label": "스윙칩만 3달 먹기", "voteCount": 99, "ratio": 76 },
    { "optionId": 11, "label": "스윙스한테 30만원 주기", "voteCount": 32, "ratio": 24 }
  ],
  "remainingFreeVotes": 2
}
```

### Response (취소 — 같은 옵션 재클릭)

```json
{
  "voteId": 1,
  "action": "CANCELED",
  "selectedOptionId": null,
  "options": [
    { "optionId": 10, "label": "스윙칩만 3달 먹기", "voteCount": null, "ratio": null },
    { "optionId": 11, "label": "스윙스한테 30만원 주기", "voteCount": null, "ratio": null }
  ],
  "remainingFreeVotes": 2
}
```

> 💡 `action` 분기
`VOTED`: 신규 투표 또는 다른 옵션으로 변경 (기존 선택 자동 해제 후 신규 카운트). 
`CANCELED`: 같은 옵션 재클릭 → 투표 취소 → `voteCount`/`ratio` 다시 `null`로 응답.

> 📌 비회원 무료 투표 차감 정책 
신규 투표(`VOTED` + 기존 미참여) → 차감. 
옵션 변경(`VOTED` + 기존 참여) → 차감하지 않음 (재선택은 무료). 
취소(`CANCELED`) → 차감하지 않음, 단 재참여 시 다시 차감. 
`remainingFreeVotes === 0` 상태에서 신규 투표 시도 → `403 VOTE_FREE_LIMIT_EXCEEDED` → 로그인 유도 팝업. `remainingFreeVotes` 1~5일 때 응답 후 프론트에서 "n회 남았어요" 토스트.

> 💡 회원은 `remainingFreeVotes: null`로 응답. 투표 횟수 제한 없음.

## GET /api/immersive-votes/{voteId}/live — 실시간 비율 폴링

| **구분** | **파라미터** | **타입** | **필수** | **설명** |
| --- | --- | --- | --- | --- |
| Path | `voteId` | `Long` | ✅ | 투표 ID |

### Response

```json
{
  "options": [
    { "optionId": 10, "voteCount": 102, "ratio": 78 },
    { "optionId": 11, "voteCount": 29, "ratio": 22 }
  ],
  "currentViewerCount": 14,
  "totalParticipantCount": 131
}
```

> 💡 투표 후(`myVote.voted: true`)에만 호출. 옵션 비율 filled bar 애니메이션 갱신용.

> 📌 `currentViewerCount`: 현재 해당 투표 화면을 보고 있는 사용자 수. 
10명 이상일 때 2분마다 5초간 토스트("현재 N명이 참여중이에요!") 노출

## PUT /api/immersive-votes/{voteId}/emoji — 이모지 반응

| **구분** | **파라미터** | **타입** | **필수** | **설명** |
| --- | --- | --- | --- | --- |
| Path | `voteId` | `Long` | ✅ | 투표 ID |
| Body | `emoji` | `LIKE | SAD | ANGRY | WOW | null` | ✅ | 선택한 이모지. `null`이면 취소 |

### Request Body

```json
{ "emoji": "WOW" }
```

### Response

```json
{
  "emojiSummary": {
    "LIKE": 21,
    "SAD": 3,
    "ANGRY": 8,
    "WOW": 37,
    "total": 132
  },
  "myEmoji": "WOW"
}
```

> 💡 이모지는 1인 1개만 가능. 다른 이모지 선택 시 기존 자동 해제 후 신규 카운트. 
같은 이모지 재클릭 또는 `emoji: null` → 선택 취소. 회원/비회원 모두 호출 가능.

> 📌 플로팅 애니메이션은 프론트 처리 (선택 즉시 화면 하단→상단 이동, 3초 후 자동 사라짐). 백엔드는 카운트만 갱신.

## GET /api/immersive-votes/{voteId}/share — 공유 링크 생성

| **구분** | **파라미터** | **타입** | **필수** | **설명** |
| --- | --- | --- | --- | --- |
| Path | `voteId` | `Long` | ✅ | 투표 ID |

### Response

```json
{
  "shareUrl": "https://vs.app/poll/12345",
  "title": "논쟁 끝판왕 밸런스게임",
  "thumbnailUrl": "https://cdn.example.com/votes/1/thumb.jpg"
}
```

## GET /api/me/free-votes — 비회원 잔여 무료 투표권 (전역)

### Response

```json
{
  "remainingFreeVotes": 2,
  "totalFreeVotes": 5
}
```

> 💡 비회원의 무료 투표권은 voteId별이 아닌 전역 카운트로 관리. 앱 진입 시 1회 호출하여 잔여 횟수 캐싱. 이후는 `participate` 응답값으로 동기화. 회원이 호출 시 `remainingFreeVotes: null` 응답.

---

# WebSocket (STOMP)

> 🔌 연결 엔드포인트: `ws://.../ws`

| **구분** | **경로** | **방향** | **설명** |
| --- | --- | --- | --- |
| 몰입형 실시간 비율 | `/topic/immersive-vote/{voteId}/live` | 수신 ← 서버 | 비율/뷰어 수 변동 시 푸시 |

### 수신 Payload

`/topic/immersive-vote/{voteId}/live`

```json
{
  "options": [
    { "optionId": 10, "voteCount": 102, "ratio": 78 },
    { "optionId": 11, "voteCount": 29, "ratio": 22 }
  ],
  "currentViewerCount": 14,
  "totalParticipantCount": 131
}
```

---

# 권한 정책

| **상황** | **처리** |
| --- | --- |
| 비회원 → 투표 상세 조회 | 허용 |
| 비회원 → 투표 참여 (1~5회, 신규) | 허용. 매 회 차감 후 응답에 잔여 횟수 포함 |
| 비회원 → 옵션 변경/취소 | 허용. 차감하지 않음 |
| 비회원 → 투표 참여 (5회 소진 후 신규) | `403 VOTE_FREE_LIMIT_EXCEEDED` → 로그인 유도 팝업 |
| 비회원 → 이모지 반응 | 허용 |
| 비회원 → 공유 | 허용 |
| 비회원 → 결과 조회 | 허용 (`insight.locked: true`로 응답) |
| 비회원 → 잠금 해제 | 로그인 페이지 랜딩 (프론트 처리). 로그인 후 재진입 시 `insight.locked: false` |
| 비회원 → 알림 목록/PUSH 토큰 | `401` |
| 비회원 → 채팅 진입 | 채팅 명세 권한 정책 참조 |
| 회원 → 미참여 결과 조회 | 허용 (`scope: TOTAL`) |
| 회원 → 참여O 결과 조회 | 허용 (`scope: MY_SELECTION`) |
| 회원 → 투표 후 다시투표하기 | 허용. ENDED 상태에서는 `403` |
| 진행 중 투표 → `/result` 호출 | `403 VOTE_NOT_ENDED` |
| 투표 종료(ENDED) → 참여/취소 | `403 VOTE_ENDED` |

---

# 에러 코드

| **코드** | **HTTP** | **설명** |
| --- | --- | --- |
| `VOTE_NOT_FOUND` | 404 | 존재하지 않는 투표 |
| `VOTE_ENDED` | 403 | 종료된 투표에 대한 참여/취소 시도 |
| `VOTE_NOT_ENDED` | 403 | 진행 중 투표에 결과 API 호출 |
| `VOTE_FREE_LIMIT_EXCEEDED` | 403 | 비회원 무료 투표 5회 초과 |
| `INVALID_OPTION` | 400 | 해당 투표에 속하지 않은 optionId |
| `INVALID_EMOJI` | 400 | 정의되지 않은 이모지 타입 |
| `IMAGE_LOAD_FAILED` | - | 백엔드 에러 아님. 프론트가 placeholder 노출 |
| `VOTE_SUBMIT_FAILED` | 500 | "투표에 실패했어요" 토스트 (2초) |
| `EMOJI_SUBMIT_FAILED` | 500 | "이모지 반응에 실패했어요" 토스트 (2초) |
| `SHARE_LINK_GENERATION_FAILED` | 500 | "공유에 실패했어요" 토스트 (2초) |
| `AI_INSIGHT_GENERATION_FAILED` | - | 에러 아님. `aiInsight.available: false`로 응답 |
| `NOTIFICATION_NOT_FOUND` | 404 | 존재하지 않는 알림 |