# REST API — 알림

# 알림

## GET `/api/notifications`

> 알림 목록 조회

알림 목록을 조회합니다. 커서 기반 페이지네이션을 지원합니다.

**인증**: Bearer Token

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `cursor` | integer(int64) |  |  |
| `size` | integer(int32) |  | (default: `20`) |

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `notifications` | array\<NotificationItem> |  |  |
| `notifications[].notificationId` | integer(int64) |  |  |
| `notifications[].type` | `VOTE_ENDED` |  |  |
| `notifications[].voteId` | integer(int64) |  |  |
| `notifications[].title` | string |  |  |
| `notifications[].body` | string |  |  |
| `notifications[].thumbnailUrl` | string |  |  |
| `notifications[].isRead` | boolean |  |  |
| `notifications[].createdAt` | string(date-time) |  |  |
| `nextCursor` | integer(int64) |  |  |
| `hasNext` | boolean |  |  |


---

## GET `/api/notifications/unread-count`

> 읽지 않은 알림 수 조회

읽지 않은 알림의 개수를 조회합니다.

**인증**: Bearer Token

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `unreadCount` | integer(int64) |  |  |


---

## POST `/api/notifications/{notificationId}/read`

> 알림 읽음 처리

특정 알림을 읽음 처리합니다.

**인증**: Bearer Token

### Path Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `notificationId` | integer(int64) | Y |  |

### Responses

#### `204` No Content


---

## POST `/api/notifications/read-all`

> 모든 알림 읽음 처리

모든 알림을 읽음 처리합니다.

**인증**: Bearer Token

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `updatedCount` | integer(int32) |  |  |


---

# 알림 설정

## GET `/api/me/notification-setting`

> 알림 설정 조회

현재 알림 설정 상태를 조회합니다.

**인증**: Bearer Token

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `pushEnabled` | boolean |  |  |
| `pushEnabledAt` | string(date-time) |  |  |
| `pushDisabledAt` | string(date-time) |  |  |


---

## PUT `/api/me/notification-setting`

> 알림 설정 변경

푸시 알림 ON/OFF 설정을 변경합니다.

**인증**: Bearer Token

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `pushEnabled` | boolean | Y |  |

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `pushEnabled` | boolean |  |  |
| `pushEnabledAt` | string(date-time) |  |  |
| `pushDisabledAt` | string(date-time) |  |  |


---

# 알림 권한 프롬프트

## GET `/api/me/notification-prompt/status`

> 프롬프트 표시 여부 조회

알림 권한 요청 프롬프트를 표시해야 하는지 여부를 조회합니다.

**인증**: Bearer Token

### Responses

#### `200` OK

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `shouldShow` | boolean |  |  |
| `totalParticipationCount` | integer(int64) |  |  |


---

## POST `/api/me/notification-prompt/dismissed`

> 프롬프트 거절 기록

사용자가 알림 권한 프롬프트를 거절했음을 기록합니다.

**인증**: Bearer Token

### Responses

#### `204` No Content


---

# 푸시 토큰

## POST `/api/devices/push-token`

> 푸시 토큰 등록

FCM/APNs 디바이스 토큰을 등록합니다. 투표 종료 시 푸시 알림 발송에 사용됩니다.

**인증**: Bearer Token

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `token` | string |  |  |
| `platform` | `IOS` / `ANDROID` | Y |  |

### Responses

#### `204` No Content


---

## DELETE `/api/devices/push-token`

> 푸시 토큰 해제

등록된 모든 푸시 토큰을 해제합니다.

**인증**: Bearer Token

### Responses

#### `204` No Content


---
