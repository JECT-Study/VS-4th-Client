# REST API — 유저 / 인증

## GET /api/users/me — 내 프로필 조회

### Request Header

| Key | Value Type | Example | Optional? | Default | Description |
| --- | --- | --- | --- | --- | --- |
| Cookie | JWT | access_token=eyJhbGci...; HttpOnly; Path=/; Max-Age=1800; SameSite=Lax | Y | - | Access Token |

### Response

`200 OK`

```json
{
  "email": "{{ String : 사용자 이메일 }}",
  "nickname": "{{ String : 서비스 닉네임 }}",
  "birthDate": "{{ LocalDate : 생년월일, yyyy형식 }}",
  "gender": "{{ String : 성별, MALE 또는 FEMALE }}",
  "imageColor": "{{ !String : 이미지 색상: GREEN, RED, BLUE, YELLOW}}",
  "userStatus": "{{ String : 사용자 가입 여부}}"
}
```

`401 Unauthorized`

```json
{
	"code" : "EMPTY_TOKEN",
	"message" : "인증 정보가 존재하지 않습니다."
}

{
	"code" : "TOKEN_EXPIRED",
	"message" : "인증 정보가 만료되었습니다."
}

{
	"code" : "INVALID_TOKEN",
	"message" : "유효하지 않은 토큰입니다."
}
```

`404 Not Found`

```json
{
    "message": "존재하지 않는 사용자입니다."
}
```

## POST /api/users/me/profile — 추가 정보 저장

### Request Header

| Key | Value Type | Example | Optional? | Default | Description |
| --- | --- | --- | --- | --- | --- |
| Cookie | JWT | access_token=eyJhbGci...; HttpOnly; Path=/; Max-Age=1800; SameSite=Lax | Y | - | Access Token |

---

### Request Body

```json
{
  "birthDate": "{{ LocalDate! : 생년월일, yyyy-MM-dd 형식 }}",
  "gender": "{{ String! : 성별, MALE 또는 FEMALE }}",
  "nickname": "{{ String! : 서비스에서 사용할 닉네임 }}",
  "imageColor": "{{ String! : 사용자가 선택한 이미지 색상: GREEN(기본), RED, BLUE, YELLOW}}"
}
```

---

### Response

`201 CREATED`

```json
{
	"nickname" : "{{!String 사용자가 설정한 닉네임}}",
	"imageColor" : " {{!String 사용자가 선택한 이미지 색상: GREEN(기본), RED, BLUE, YELLOW}}"
}
```

`401 Unauthorized`

```json
{
  "message": "인증되지 않은 사용자",
}
```

`404 Not Found`

```json
{
    "message": "사용자 정보 없음"
}
```

`500 Internal Server Error`

```json
{
    "message": "서버 내부 오류",
}
```

## GET /api/user/nickname/suggest — 닉네임 추천

### Request Header

| Key | Value Type | Example | Optional? | Default | Description |
| --- | --- | --- | --- | --- | --- |
| Cookie | JWT | access_token=eyJhbGci...; HttpOnly; Path=/; Max-Age=1800; SameSite=Lax | Y | - | Access Token |

---

### Response

`200 OK`

```json
{
	"nickname" : "{{!String: 닉네임}}"
}
```

`401 Unauthorized`

```json
{
	"message": "인증 정보가 존재하지 않습니다."
}
```

## POST /api/users/nickname/check — 닉네임 사용 가능 여부 확인

### Request Header

| Key | Value Type | Example | Optional? | Default | Description |
| --- | --- | --- | --- | --- | --- |
| Cookie | JWT | access_token=eyJhbGci...; HttpOnly; Path=/; Max-Age=1800; SameSite=Lax | Y | - | Access Token |

---

### Request Body

```json
{
  "nickname": "{{ String! : 사용 가능 여부를 확인할 닉네임 }}"
}
```

---

### Response

`400 Bad Request`

```json
{
	"message": "닉네임 형식 오류"
}
```

`401 Unauthorized`

```json
{
  "message": "인증 정보가 존재하지 않습니다.",
}
```

`500 Internal Server Error`

```json
{
  "message": "서버 내부 오류",
}
```


## POST /api/auth/reissue — Refresh Token을 검증하여 새로운 Access Token 발급

### Request Header

| Key | Value Type | Example | Optional? | Default | Description |
| --- | --- | --- | --- | --- | --- |
| Cookie |  | refresh_token=eyJhbGciOiJIUzUxMiJ9… | N | - | Access Token 재발급에 사용할 Refresh Token Cookie |

---

### Response Header

`200 OK`

```json
{
  Set-Cookie: access_token={NEW_ACCESS_TOKEN}; HttpOnly; Path=/; Max-Age=3600
}
```

`401 Unauthorized`

```json
{
  "message": "인증 정보가 존재하지 않습니다."
}
```

`404 Not Found`

```json
{
  "message": "존재하지 않은 사용자입니다."
}
```

`500 Internal Server Error`

```json
{
  "message": "서버 내부 오류"
}
```


## GET /api/users/info — 회원가입 과정에서 추가 정보 default 값

### Request Header

| Key | Value Type | Example | Optional? | Default | Description |
| --- | --- | --- | --- | --- | --- |
| Cookie |  | refresh_token=eyJhbGciOiJIUzUxMiJ9… | N | - | Access Token 재발급에 사용할 Refresh Token Cookie |


### Response

`200 OK`

```json
{
	"nickname" : {{!String : 닉네임}},
	"imageColor" : {{!String : 이미지 색: GREEN(기본), RED, BLUE, YELLOW}}
}
```

`401 Unauthorized`

```json
{
	"message": "사용자 정보가 없습니다."
}
```