# REST API — 홈 / 추천 투표

# 홈 피드

## GET `/api/home/votes`

> 전체 투표 목록 조회

전체 투표 목록을 조회합니다. 커서 기반 페이지네이션을 지원합니다. 종료된 투표 제외 필터를 지원합니다.

**인증**: Bearer Token

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `cursor` | string |  | 다음 페이지 조회를 위한 커서 (이전 응답의 nextCursor). 복합 커서 사용 (예: LATEST=ID, ENDING_SOON=endAtMillis:id, POPULAR=viewCount:id) |
| `size` | integer(int32) |  | 페이지 크기 (default: `10`) |
| `sort` | `LATEST` / `POPULAR` / `ENDING_SOON` |  | 정렬 기준: LATEST(최신순), POPULAR(인기순), ENDING_SOON(종료임박순) (default: `LATEST`) |
| `excludeEnded` | boolean |  | 종료된 투표 제외 여부 (true 시 진행 중인 투표만 반환) (default: `False`) |

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `votes` | array\<VoteListItem> |  |  |
| `votes[].voteId` | integer(int64) |  |  |
| `votes[].thumbnailUrl` | string |  |  |
| `votes[].status` | `ONGOING` / `ENDED` |  |  |
| `votes[].title` | string |  |  |
| `votes[].content` | string |  |  |
| `votes[].endAt` | string(date-time) |  |  |
| `nextCursor` | string |  |  |
| `hasNext` | boolean |  |  |


---

## GET `/api/home/recommendations`

> 오늘의 추천 조회

운영진이 선정한 오늘의 추천 투표 목록을 조회합니다.

**인증**: Bearer Token

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `recommendations` | array\<RecommendationItem> |  |  |
| `recommendations[].voteId` | integer(int64) |  |  |
| `recommendations[].thumbnailUrl` | string |  |  |
| `recommendations[].title` | string |  |  |
| `recommendations[].content` | string |  |  |
| `recommendations[].endAt` | string(date-time) |  |  |


---

## GET `/api/home/hot-topics`

> 핫토픽 TOP 3 조회

인기 점수 기준 상위 3개 투표를 조회합니다. 인기 점수 = (참여 수 × 0.7) + (조회 수 × 0.3)

**인증**: Bearer Token

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `hotTopics` | array\<HotTopicItem> |  |  |
| `hotTopics[].rank` | integer(int32) |  |  |
| `hotTopics[].voteId` | integer(int64) |  |  |
| `hotTopics[].thumbnailUrl` | string |  |  |
| `hotTopics[].title` | string |  |  |
| `hotTopics[].content` | string |  |  |
| `hotTopics[].participantCount` | integer(int64) |  |  |
| `hotTopics[].endAt` | string(date-time) |  |  |


---

# 추천 투표 관리 (어드민)

## POST `/api/recommendations`

> 오늘의 추천 투표 설정

운영진이 오늘의 추천 투표를 설정합니다.

**인증**: Bearer Token

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `voteIds` | array\<integer> |  |  |

### Responses

#### `200` OK


---
