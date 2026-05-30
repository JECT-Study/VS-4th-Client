# REST API — 이미지

# 이미지 업로드 / 삭제

## POST `/api/images`

**인증**: Bearer Token

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `file` | string(binary) | Y |  |

### Responses

#### `201` Created

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `imageUrl` | string |  |  |


---

## DELETE `/api/images`

**인증**: Bearer Token

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `url` | string | Y |  |

### Responses

#### `204` No Content


---
