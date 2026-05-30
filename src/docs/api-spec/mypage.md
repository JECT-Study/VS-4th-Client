# REST API — 마이페이지

# 내 프로필

## GET `/api/users/me`

> 내 프로필 조회

로그인한 사용자의 프로필 정보를 조회합니다.

**인증**: Bearer Token

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `birthDate` | string |  |  |
| `gender` | `MALE` / `FEMALE` |  |  |
| `nickname` | string |  |  |
| `imageColor` | `GREEN` / `RED` / `BLUE` / `YELLOW` |  |  |


---

## PATCH `/api/users/change/info`

**인증**: Bearer Token

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `nickname` | string |  |  |
| `imageColor` | `GREEN` / `RED` / `BLUE` / `YELLOW` |  |  |

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `` | object |  |  |


---

## DELETE `/api/users/profile/delete`

**인증**: Bearer Token

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `category` | string |  |  |
| `reasone` | string |  |  |

### Responses

#### `200` OK


---

# 내가 참여한 투표

## GET `/api/votes/me/participated`

**인증**: Bearer Token

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `type` | `LATEST` / `END_AT` / `POPULAR` | Y |  |

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `count` | integer(int64) |  |  |
| `voteList` | array\<VoteElement> |  |  |
| `voteList[].id` | integer(int64) |  |  |
| `voteList[].title` | string |  |  |
| `voteList[].content` | string |  |  |
| `voteList[].thumbnailUrl` | string |  |  |
| `voteList[].localDate` | string(date-time) |  |  |
| `voteList[].endAt` | string(date-time) |  |  |


---

## GET `/api/votes/me/participated/end`

**인증**: Bearer Token

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `type` | `LATEST` / `END_AT` / `POPULAR` | Y |  |

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `count` | integer(int64) |  |  |
| `voteList` | array\<VoteElement> |  |  |
| `voteList[].id` | integer(int64) |  |  |
| `voteList[].title` | string |  |  |
| `voteList[].content` | string |  |  |
| `voteList[].thumbnailUrl` | string |  |  |
| `voteList[].localDate` | string(date-time) |  |  |
| `voteList[].endAt` | string(date-time) |  |  |


---
