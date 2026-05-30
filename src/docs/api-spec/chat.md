# REST API — 채팅

# 채팅방

## GET `/api/chats`

> 채팅방 목록 조회

로그인 사용자가 참여한 채팅방을 투표 진행 상태별로 조회합니다.

**인증**: Bearer Token

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `status` | `ONGOING` / `ENDED` | Y | 조회할 투표 상태 |

### Responses

#### `200` 채팅방 목록 조회 성공

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `chats` | array\<ChatListItemResponse> |  | 조회된 채팅방 목록 |
| `chats[].voteId` | integer(int64) |  | 채팅방이 연결된 투표 ID |
| `chats[].title` | string |  | 투표 제목 |
| `chats[].thumbnailUrl` | string |  | 투표 썸네일 이미지 URL |
| `chats[].optionA` | string |  | A 선택지 이름 |
| `chats[].optionB` | string |  | B 선택지 이름 |
| `chats[].participantCount` | integer(int32) |  | 투표 참여자 수 |
| `chats[].lastMessage` | string |  | 채팅방의 마지막 메시지 내용 |
| `chats[].lastMessageAt` | string(date-time) |  | 마지막 메시지가 전송된 시각. UTC 기준으로 내려가며 사용자 시간대에 맞춰 변환이 필요합니다. |
| `chats[].endAt` | string(date-time) |  | 투표 종료 시각. UTC 기준으로 내려가며 사용자 시간대에 맞춰 변환이 필요합니다. |
| `chats[].unreadCount` | integer(int32) |  | 현재 사용자가 아직 읽지 않은 메시지 수 |

#### `401` 인증되지 않은 사용자


---

## GET `/api/chats/{voteId}`

> 채팅방 상세 조회

채팅방 상단에 표시할 투표 제목, 진행 상태, 선택지, 참여자 수, 종료 시간을 조회합니다.

**인증**: Bearer Token

### Path Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `voteId` | integer(int64) | Y | 채팅방이 연결된 투표 ID |

### Responses

#### `200` 채팅방 상세 조회 성공

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `voteId` | integer(int64) |  | 채팅방이 연결된 투표 ID |
| `title` | string |  | 투표 제목 |
| `status` | `ONGOING` / `ENDED` |  | 투표 진행 상태 |
| `participantCount` | integer(int32) |  | 투표 참여자 수 |
| `optionA` | string |  | A 선택지 이름 |
| `optionB` | string |  | B 선택지 이름 |
| `endAt` | string(date-time) |  | 투표 종료 시각. UTC 기준으로 내려가며 사용자 시간대에 맞춰 변환이 필요합니다. |

#### `401` 인증되지 않은 사용자

#### `404` 존재하지 않는 투표 또는 채팅방


---

## GET `/api/chats/{voteId}/gauge`

> 투표 게이지 조회

채팅방에서 표시할 A/B 선택지 투표 비율과 참여자 수를 조회합니다. 비율 값은 0부터 100까지의 정수입니다.

**인증**: Bearer Token

### Path Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `voteId` | integer(int64) | Y | 게이지를 조회할 투표 ID |

### Responses

#### `200` 투표 게이지 조회 성공

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `optionARatio` | integer(int32) |  | A 선택지 투표 비율. 0부터 100까지의 정수입니다. |
| `optionBRatio` | integer(int32) |  | B 선택지 투표 비율. 0부터 100까지의 정수입니다. |
| `participantCount` | integer(int32) |  | 투표 참여자 수 |

#### `404` 존재하지 않는 투표


---

# 메시지

## GET `/api/chats/{voteId}/messages`

> 채팅 메시지 목록 조회

채팅방 메시지를 커서 기반으로 조회합니다. cursor가 없으면 최신 메시지 기준으로 조회하고, nextCursor와 hasNext로 다음 페이지 요청 여부를 판단합니다.

**인증**: Bearer Token

### Path Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `voteId` | integer(int64) | Y | 메시지를 조회할 투표 ID |

### Query Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `cursor` | integer(int64) |  | 이전 페이지의 nextCursor. 첫 조회 시 생략합니다. |
| `size` | integer(int32) |  | 조회할 메시지 수 (default: `30`) |

### Responses

#### `200` 채팅 메시지 목록 조회 성공

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `messages` | array\<MessageResponse> |  | 조회된 메시지 목록 |
| `messages[].messageId` | integer(int64) |  | 채팅 메시지 ID |
| `messages[].content` | string |  | 메시지 내용 |
| `messages[].sentAt` | string(date-time) |  | 메시지 전송 시각. UTC 기준으로 내려가며 사용자 시간대에 맞춰 변환이 필요합니다. |
| `messages[].senderNickname` | string |  | 메시지를 보낸 사용자의 닉네임 |
| `messages[].senderProfileIcon` | `GREEN` / `RED` / `BLUE` / `YELLOW` |  | 메시지를 보낸 사용자의 프로필 아이콘 색상 |
| `messages[].senderVoteOption` | `A` / `B` |  | 메시지를 보낸 사용자가 선택한 투표 선택지 |
| `messages[].isMine` | boolean |  | 현재 로그인 사용자가 보낸 메시지인지 여부 |
| `nextCursor` | integer(int64) |  | 다음 페이지 조회에 사용할 커서. 다음 페이지가 없으면 null입니다. |
| `hasNext` | boolean |  | 다음 페이지 존재 여부 |

#### `401` 인증되지 않은 사용자

#### `403` 채팅방 접근 권한 없음

#### `404` 존재하지 않는 투표 또는 채팅방


---

## POST `/api/chats/{voteId}/messages`

> 채팅 메시지 전송

채팅방에 새 메시지를 전송하고 저장된 메시지 정보를 반환합니다.

**인증**: Bearer Token

### Path Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `voteId` | integer(int64) | Y | 메시지를 전송할 투표 ID |

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `content` | string | Y | 전송할 메시지 내용 |

### Responses

#### `201` 채팅 메시지 전송 성공

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `messageId` | integer(int64) |  | 채팅 메시지 ID |
| `content` | string |  | 메시지 내용 |
| `sentAt` | string(date-time) |  | 메시지 전송 시각. UTC 기준으로 내려가며 사용자 시간대에 맞춰 변환이 필요합니다. |
| `senderNickname` | string |  | 메시지를 보낸 사용자의 닉네임 |
| `senderProfileIcon` | `GREEN` / `RED` / `BLUE` / `YELLOW` |  | 메시지를 보낸 사용자의 프로필 아이콘 색상 |
| `senderVoteOption` | `A` / `B` |  | 메시지를 보낸 사용자가 선택한 투표 선택지 |
| `isMine` | boolean |  | 현재 로그인 사용자가 보낸 메시지인지 여부 |

#### `400` 메시지 내용이 비어 있거나 유효하지 않음

#### `401` 인증되지 않은 사용자

#### `403` 채팅방 접근 권한 없음

#### `404` 존재하지 않는 투표 또는 채팅방


---

## POST `/api/chats/{voteId}/read`

> 채팅방 읽음 처리

사용자가 마지막으로 읽은 메시지 ID를 저장해 이후 채팅방 목록의 unreadCount 계산에 사용합니다.

**인증**: Bearer Token

### Path Parameters

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `voteId` | integer(int64) | Y | 읽음 처리할 투표 ID |

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `lastReadMessageId` | integer(int64) | Y | 현재 사용자가 마지막으로 읽은 메시지 ID |

### Responses

#### `204` 읽음 처리 성공

#### `400` 마지막 읽은 메시지 ID가 유효하지 않음

#### `401` 인증되지 않은 사용자

#### `403` 채팅방 접근 권한 없음

#### `404` 존재하지 않는 투표, 채팅방 또는 메시지


---
