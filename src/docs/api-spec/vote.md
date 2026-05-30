# REST API — 일반형 투표

# 투표 CRUD

## POST `/api/votes`

> 투표 생성

새로운 투표를 생성합니다. 회원만 가능합니다.

**인증**: Bearer Token

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `type` | `GENERAL` / `IMMERSIVE` | Y |  |
| `title` | string |  |  |
| `content` | string |  |  |
| `thumbnailUrl` | string |  |  |
| `imageUrl` | string |  |  |
| `duration` | `HOURS_12` / `HOURS_24` | Y |  |
| `optionA` | string |  |  |
| `optionB` | string |  |  |

### Responses

#### `201` Created

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `voteId` | integer(int64) |  |  |
| `status` | string |  |  |
| `endAt` | string(date-time) |  |  |


---

## GET `/api/votes/{voteId}`

> 투표 상세 조회

투표 상세 정보를 조회합니다. 투표 전에는 결과(voteCount/ratio)가 null로 응답됩니다.

**인증**: Bearer Token

### Path Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `voteId` | integer(int64) | Y |  |

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `voteId` | integer(int64) |  |  |
| `title` | string |  |  |
| `createdAt` | string(date-time) |  |  |
| `content` | string |  |  |
| `thumbnailUrl` | string |  |  |
| `status` | string |  |  |
| `endAt` | string(date-time) |  |  |
| `participantCount` | integer(int32) |  |  |
| `options` | array\<OptionItem> |  |  |
| `options[].optionId` | integer(int64) |  |  |
| `options[].label` | string |  |  |
| `options[].voteCount` | integer(int64) |  |  |
| `options[].ratio` | integer(int32) |  |  |
| `myVote.voted` | boolean |  |  |
| `myVote.selectedOptionId` | integer(int64) |  |  |
| `emojiSummary.LIKE` | integer(int64) |  |  |
| `emojiSummary.SAD` | integer(int64) |  |  |
| `emojiSummary.ANGRY` | integer(int64) |  |  |
| `emojiSummary.WOW` | integer(int64) |  |  |
| `emojiSummary.total` | integer(int64) |  |  |
| `myEmoji` | string |  |  |
| `commentCount` | integer(int32) |  |  |


---

## POST `/api/votes/{voteId}/participate`

> 투표 참여

투표에 참여합니다. 비회원은 5회까지 무료 투표 가능합니다.

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
| `selectedOptionId` | integer(int64) |  |  |
| `options` | array\<OptionItem> |  |  |
| `options[].optionId` | integer(int64) |  |  |
| `options[].label` | string |  |  |
| `options[].voteCount` | integer(int64) |  |  |
| `options[].ratio` | integer(int32) |  |  |
| `participantCount` | integer(int32) |  |  |
| `remainingFreeVotes` | integer(int32) |  |  |


---

## DELETE `/api/votes/{voteId}/participate`

> 다시 투표하기

투표를 취소합니다. 회원만 가능합니다.

**인증**: Bearer Token

### Path Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `voteId` | integer(int64) | Y |  |

### Responses

#### `204` No Content


---

## PUT `/api/votes/{voteId}/emoji`

> 일반형 투표 이모지 반응

이모지 반응을 추가/변경/취소합니��. 같은 이모지 재선택 또는 null 전송 시 취소됩니다.

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

# 투표 결과 / 공유

## GET `/api/votes/{voteId}/result`

> 투표 결과 조회

마감된 투표의 결과를 조회합니다. 진행 중 투표는 403 응답합니다. 비회원은 insight가 잠금 상태로 응답됩니다.

**인증**: Bearer Token

### Path Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `voteId` | integer(int64) | Y |  |

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `voteId` | integer(int64) |  |  |
| `title` | string |  |  |
| `createdAt` | string(date-time) |  |  |
| `content` | string |  |  |
| `thumbnailUrl` | string |  |  |
| `status` | string |  |  |
| `endAt` | string(date-time) |  |  |
| `participantCount` | integer(int32) |  |  |
| `result.options` | array\<OptionItem> |  |  |
| `result.options[].optionId` | integer(int64) |  |  |
| `result.options[].label` | string |  |  |
| `result.options[].voteCount` | integer(int64) |  |  |
| `result.options[].ratio` | integer(int32) |  |  |
| `myVote.voted` | boolean |  |  |
| `myVote.selectedOptionId` | integer(int64) |  |  |
| `insight.locked` | boolean |  |  |
| `insight.scope` | string |  |  |
| `insight.selectionCount` | integer(int32) |  |  |
| `insight.genderDistribution.total` | integer(int32) |  |  |
| `insight.genderDistribution.female.count` | integer(int64) |  |  |
| `insight.genderDistribution.female.ratio` | integer(int32) |  |  |
| `insight.genderDistribution.male.count` | integer(int64) |  |  |
| `insight.genderDistribution.male.ratio` | integer(int32) |  |  |
| `insight.genderDistribution.highlightedGender` | string |  |  |
| `insight.ageDistribution` | array\<AgeDistributionResponse> |  |  |
| `insight.ageDistribution[].ageGroup` | string |  |  |
| `insight.ageDistribution[].ratio` | integer(int32) |  |  |
| `insight.ageDistribution[].isMyGroup` | boolean |  |  |
| `aiInsight.available` | boolean |  |  |
| `aiInsight.headline` | string |  |  |
| `aiInsight.body` | string |  |  |


---

## GET `/api/votes/{voteId}/share`

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
