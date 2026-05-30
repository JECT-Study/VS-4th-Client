# REST API — 몰입형 투표

# 피드 / 참여

## GET `/api/immersive-votes`

> 몰입형 투표 피드 조회

스와이프 형식의 몰입형 투표 피드를 조회합니다. 커서 기반 페이지네이션을 지원합니다.

**인증**: Bearer Token

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `cursor` | integer(int64) |  |  |
| `size` | integer(int32) |  | (default: `10`) |

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `votes` | array\<VoteItem> |  |  |
| `votes[].voteId` | integer(int64) |  |  |
| `votes[].title` | string |  |  |
| `votes[].content` | string |  |  |
| `votes[].imageUrl` | string |  |  |
| `votes[].endAt` | string(date-time) |  |  |
| `votes[].options` | array\<OptionItem> |  |  |
| `votes[].options[].optionId` | integer(int64) |  |  |
| `votes[].options[].label` | string |  |  |
| `votes[].options[].voteCount` | integer(int64) |  |  |
| `votes[].options[].ratio` | integer(int32) |  |  |
| `votes[].myVote.voted` | boolean |  |  |
| `votes[].myVote.selectedOptionId` | integer(int64) |  |  |
| `votes[].emojiSummary.LIKE` | integer(int64) |  |  |
| `votes[].emojiSummary.SAD` | integer(int64) |  |  |
| `votes[].emojiSummary.ANGRY` | integer(int64) |  |  |
| `votes[].emojiSummary.WOW` | integer(int64) |  |  |
| `votes[].emojiSummary.total` | integer(int64) |  |  |
| `votes[].myEmoji` | string |  |  |
| `votes[].commentCount` | integer(int32) |  |  |
| `votes[].currentViewerCount` | integer(int32) |  |  |
| `nextCursor` | integer(int64) |  |  |
| `hasNext` | boolean |  |  |


---

## POST `/api/immersive-votes/{voteId}/participate`

> 투표 참여/취소

투표에 참여하거나 같은 옵션 재클릭 시 취소합니다. 비회원은 5회까지 무료 투표 가능합니다.

**인증**: Bearer Token

### Path Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `voteId` | integer(int64) | Y |  |

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `optionId` | integer(int64) | Y |  |

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `voteId` | integer(int64) |  |  |
| `action` | string |  |  |
| `selectedOptionId` | integer(int64) |  |  |
| `options` | array\<OptionItem> |  |  |
| `options[].optionId` | integer(int64) |  |  |
| `options[].label` | string |  |  |
| `options[].voteCount` | integer(int64) |  |  |
| `options[].ratio` | integer(int32) |  |  |
| `remainingFreeVotes` | integer(int32) |  |  |


---

## PUT `/api/immersive-votes/{voteId}/emoji`

> 몰입형 투표 이모지 반응

이모지 반응을 추가/변경/취소합니다. 같은 이모지 재선택 또는 null 전송 시 취소됩니다.

**인증**: Bearer Token

### Path Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `voteId` | integer(int64) | Y |  |

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `emoji` | `LIKE` / `SAD` / `ANGRY` / `WOW` |  |  |

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `emojiSummary.LIKE` | integer(int64) |  |  |
| `emojiSummary.SAD` | integer(int64) |  |  |
| `emojiSummary.ANGRY` | integer(int64) |  |  |
| `emojiSummary.WOW` | integer(int64) |  |  |
| `emojiSummary.total` | integer(int64) |  |  |
| `myEmoji` | string |  |  |


---

## GET `/api/immersive-votes/{voteId}/live`

> 실시간 투표 현황 조회

투표 후 실시간 비율 갱신을 위한 폴링 API입니다.

**인증**: Bearer Token

### Path Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `voteId` | integer(int64) | Y |  |

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `options` | array\<OptionItem> |  |  |
| `options[].optionId` | integer(int64) |  |  |
| `options[].label` | string |  |  |
| `options[].voteCount` | integer(int64) |  |  |
| `options[].ratio` | integer(int32) |  |  |
| `currentViewerCount` | integer(int32) |  |  |
| `totalParticipantCount` | integer(int32) |  |  |


---

## GET `/api/immersive-votes/{voteId}/share`

> 공유 링크 생성

투표 공유를 위한 링크를 생성합니다.

**인증**: Bearer Token

### Path Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `voteId` | integer(int64) | Y |  |

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `shareUrl` | string |  |  |
| `title` | string |  |  |
| `thumbnailUrl` | string |  |  |


---

# 비회원 무료 투표

## GET `/api/me/free-votes`

> 잔여 무료 투표권 조회

비회원의 잔여 무료 투표권 수를 조회합니다. 회원은 remainingFreeVotes가 null로 응답됩니다.

**인증**: Bearer Token

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `remainingFreeVotes` | integer(int32) |  |  |
| `totalFreeVotes` | integer(int32) |  |  |


---
