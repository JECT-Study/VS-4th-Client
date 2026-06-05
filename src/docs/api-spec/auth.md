# REST API — 인증 / 사용자

# 인증

## POST `/auth/reissue`

> 토큰 재발급

Refresh Token으로 Access Token을 재발급합니다.

**인증**: Bearer Token

### Responses

#### `200` OK


---

## POST `/api/users/logout`

**인증**: Bearer Token

### Responses

#### `200` OK


---

# 회원가입 / 프로필 설정

## POST `/api/users/info`

> 기본 프로필 초기화

사용자 기본 프로필 정보를 초기화합니다.

**인증**: Bearer Token

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `email` | string |  |  |
| `birthYear` | string |  |  |
| `gender` | `MALE` / `FEMALE` |  |  |

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `nickname` | string |  |  |
| `imageColor` | string |  |  |


---

## GET `/api/users/nickname/suggest`

> 닉네임 추천

사용 가능한 랜덤 닉네임을 추천합니다.

**인증**: Bearer Token

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `nickname` | string |  |  |


---

## POST `/api/users/nickname/check`

> 닉네임 중복 확인

닉네임 사용 가능 여부를 확인합니다.

**인증**: Bearer Token

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `nickname` | string |  |  |

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `isAvailable` | boolean |  |  |


---

## GET `/api/users/imagecolor/suggest`

**인증**: Bearer Token

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `imageColor` | `GREEN` / `RED` / `BLUE` / `YELLOW` |  |  |


---

## POST `/api/users/me/profile`

> 추가 정보 설정

사용자 추가 정보(닉네임, 성별, 생년월일)를 설정합니다.

**인증**: Bearer Token

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `birthDate` | string |  |  |
| `gender` | `MALE` / `FEMALE` |  |  |
| `nickName` | string |  |  |
| `imageColor` | `GREEN` / `RED` / `BLUE` / `YELLOW` |  |  |

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `birthDate` | string |  |  |
| `gender` | `MALE` / `FEMALE` |  |  |
| `nickname` | string |  |  |
| `imageColor` | `GREEN` / `RED` / `BLUE` / `YELLOW` |  |  |


---

## POST `/api/users/nickname/slang`

> 닉네임 욕설 여부 포함 확인

닉네임을 설정할 때 금칙어가 포함되어 있는지 판단한다.

**인증**: Bearer Token

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `nickname` | string |  | 사용 가능 여부를 확인할 닉네임 |

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `isAvailable` | boolean |  | 욕설포함여부 |


#### 400 Bad Request

```json
{
	"message": "닉네임 형식 오류"
}
```
---
