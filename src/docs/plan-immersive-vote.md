# 몰입형 투표 페이지 구현 플랜

> **상태**: UI 1차 구현 완료 / API mock 연동 완료 / STOMP 연동 완료 / 실제 API 연동 완료  
> **참조 디자인**: `src/docs/design-screenshots/immersive-vote` 
> **참조 문서**: `src/docs/prd/immersive-vote.md`, `src/docs/api-spec/vote.md`

---

## 목표

`/immersive-votes` 라우트에 풀스크린 카드 + 쇼츠형 세로 슬라이드 방식의 몰입형 투표 피드 페이지를 구현한다.

---

## Handoff 진행 상황 (2026-05-14 3차)

### 완료된 작업

#### 1차 (UI + mock 데이터 기반)
- `/immersive-votes` 라우트 추가: `src/pages/routes/immersive-votes.index.tsx`
- TanStack Router 생성 파일 갱신: `src/app/config/routeTree.gen.ts`
- `src/features/immersive-vote` slice 신규 추가
  - `api/mockImmersiveData.ts`
  - `config/constants.ts`
  - `model/types.ts`
  - `model/useImmersiveFeed.ts`
  - `model/useImmersiveVote.ts`
  - `ui/ImmersiveVotePage.tsx`
  - `ui/ImmersiveVoteCard.tsx`
  - `ui/ImmersiveVoteTimer.tsx`
  - `ui/VoteContentSection.tsx`
  - `ui/ImmersiveVoteOptions.tsx`
  - `ui/ImmersiveVoteOptionCard.tsx`
  - `ui/EmojiReactionButton.tsx`
  - `ui/EmojiPicker.tsx`
  - `ui/FloatingEmojiContainer.tsx`
- 전역 CSS에 이모지 플로팅 애니메이션 추가: `src/app/styles/index.css`
- 목업 데이터 기반 UI/인터랙션 구현
  - 카드 렌더링, 타이머, 본문 전체보기/접기
  - 카드들을 세로 트랙으로 렌더링하고 `translate3d` transition으로 다음 카드가 아래에서 올라오는 쇼츠형 전환 구현
  - 위로 스와이프 또는 마우스 휠 아래 방향으로 다음 목업 투표 이동
  - 터치/휠 공통 700ms cooldown 적용으로 한 번의 제스처에서 여러 투표가 연속 이동하지 않도록 제한
  - 스와이프 다운/마우스 휠 위 방향의 이전 투표 이동은 지원하지 않음 (`nextCursor` 기반 API 전제)
  - 옵션 선택, 동일 옵션 재클릭 취소, 다른 옵션 선택 변경
  - 우측 세로 이모지 버튼, picker, 선택 강조, 하단→상단 플로팅 애니메이션
  - 채팅 버튼: 비회원은 `ChatAuthRequiredModal`, 회원은 `DynamicBottomSheet` placeholder
  - 공유 버튼: `ImmersiveShareModal` 구현 (shareUrl 클립보드 복사)
  - 하단 `BottomTabBar` 재사용, `VOTE` 탭 활성화

#### 2차 (API mock 연동 + 비회원 정책 + build 복구)

**Build 복구**
- `pnpm build` 실패 원인이던 미사용 `apiClient` import를 다음 8개 파일에서 제거

**타입 추가** (`src/features/immersive-vote/model/types.ts`)
- `ImmersiveParticipateResponse` — POST /api/immersive-votes/{voteId}/participate 응답
- `ImmersiveShareResponse` — GET /api/immersive-votes/{voteId}/share 응답
- 이모지 응답은 기존 `EmojiResponse` (`@features/votes/model/types`) 재사용

**API 레이어 신규 생성** (MOCK_START/MOCK_END 패턴, 실제 호출 주석 처리)
- `src/features/immersive-vote/api/immersiveFeedQuery.ts`
- `src/features/immersive-vote/api/immersiveVoteParticipate.ts`
- `src/features/immersive-vote/api/immersiveVoteEmoji.ts`
- `src/features/immersive-vote/api/immersiveShareQuery.ts`
- `src/features/immersive-vote/ui/ImmersiveShareModal.tsx`

**`useImmersiveFeed.ts` 업데이트**
- `useState(mockImmersiveVotes)` → `useQuery(immersiveFeedQueryOptions())` + `useEffect`로 votes state 초기화
- `nextCursorRef`로 cursor 관리, `currentIndex`가 끝에서 3개 이내일 때 다음 페이지 자동 append

**`useImmersiveVote.ts` 업데이트**
- 로컬 상태 토글 → `useMutation` + optimistic update
  - `onMutate`: snapshot 캡처 → optimistic 업데이트 (VOTED/CANCEL 분기)
  - `onSuccess`: 서버 응답(옵션 ratio)으로 보정
  - `onError`: snapshot으로 롤백; `VOTE_FREE_LIMIT_EXCEEDED` 403 → `onFreeVoteLimitExceeded()` 호출
- 이모지도 `useMutation` + optimistic update + onError rollback 적용
- `userQueryOptions`, `freeVotesQueryOptions` 연결 — 비회원 무료 투표 소진 시 사전 차단

**라우트 loader 추가** (`src/pages/routes/immersive-votes.index.tsx`)
- `queryClient.prefetchQuery(immersiveFeedQueryOptions())` — 라우트 진입 시 피드 사전 로드

#### 3차 (STOMP 실시간 연동 + 실제 API 교체 + PRD 갭 수정)

**STOMP 실시간 기능**
- `pnpm add @stomp/stompjs 7.3.0`
- `src/base/api/stompClient.ts` 신규 생성 — `@stomp/stompjs` Client 싱글턴
  - brokerURL: `${import.meta.env.VITE_WS_BASE_URL}/ws`
  - reconnectDelay: 5000
  - 공개 메서드: `activate()`, `deactivate()`, `subscribe(destination, callback) → StompSubscription`
- `src/features/immersive-vote/model/types.ts` — `ImmersiveLivePayload` 타입 추가
- `src/features/immersive-vote/config/constants.ts` — `LIVE_TOAST_MIN_VIEWERS = 10`, `LIVE_TOAST_INTERVAL_MS = 60_000` 추가
- `src/features/immersive-vote/model/useImmersiveVoteLive.ts` 신규 구현
  - `myVote.voted === true`일 때만 `/topic/immersive-vote/{voteId}/live` 구독
  - 수신 payload → `updateVote`로 options ratio + currentViewerCount 반영
  - viewer count ≥ 10 + 60초 간격으로 `showToast.info("현재 N명이 참여중이에요!", 5000)` (5초 노출)
  - voteId 변경 또는 unmount 시 `subscription.unsubscribe()` cleanup
  - STOMP 미연결 시 try/catch 로 silently skip
- `src/features/immersive-vote/ui/ImmersiveVoteCard.tsx` — `useImmersiveVoteLive(vote, updateVote)` 호출 추가

**실제 API 연동 (mock → apiClient)**
- `immersiveFeedQuery.ts` — `GET /api/immersive-votes?cursor=X&size=10`
- `immersiveVoteParticipate.ts` — `POST /api/immersive-votes/{voteId}/participate`
- `immersiveVoteEmoji.ts` — `PUT /api/immersive-votes/{voteId}/emoji`
- `immersiveShareQuery.ts` — `GET /api/immersive-votes/{voteId}/share`

**PRD 갭 수정**
- `src/base/ui/Toast/index.tsx` — `showToast.info(message, duration?)` optional duration 파라미터 추가 (기본값 Toaster의 2000ms)
- `src/features/immersive-vote/model/useImmersiveFeed.ts` — `isError` 반환값 추가
- `src/features/immersive-vote/ui/ImmersiveVoteErrorPage.tsx` 신규 생성 (빈 컴포넌트 — UI는 별도 작업)
- `src/features/immersive-vote/ui/ImmersiveVotePage.tsx` — `isError` 분기 → `ImmersiveVoteErrorPage` 렌더링

---

## 현재 파일 구조

```
src/base/api/
  stompClient.ts                   ✅ 완료 (STOMP Client 싱글턴)

src/pages/routes/
  immersive-votes.index.tsx        ✅ 완료 (route loader 포함)

src/features/immersive-vote/
  config/
    constants.ts                   ✅ 완료 (LIVE_TOAST 상수 포함)
  model/
    types.ts                       ✅ 완료 (ImmersiveLivePayload 포함)
    useImmersiveFeed.ts            ✅ 완료 (isError 포함)
    useImmersiveVote.ts            ✅ 완료 (mutation + 비회원 정책)
    useImmersiveVoteLive.ts        ✅ 완료 (STOMP 구독)
  api/
    mockImmersiveData.ts           (미사용 — 삭제 가능)
    immersiveFeedQuery.ts          ✅ 완료 (실제 API)
    immersiveVoteParticipate.ts    ✅ 완료 (실제 API)
    immersiveVoteEmoji.ts          ✅ 완료 (실제 API)
    immersiveShareQuery.ts         ✅ 완료 (실제 API)
  ui/
    ImmersiveVotePage.tsx          ✅ 완료 (isLoading/isError 처리)
    ImmersiveVoteErrorPage.tsx     ⬜ 빈 컴포넌트 (UI 구현 필요)
    ImmersiveVoteCard.tsx          ✅ 완료 (useImmersiveVoteLive 연결)
    ImmersiveVoteTimer.tsx         ✅ 완료
    VoteContentSection.tsx         ✅ 완료
    ImmersiveVoteOptions.tsx       ✅ 완료
    ImmersiveVoteOptionCard.tsx    ✅ 완료 (filled bar 600ms ease-out)
    EmojiReactionButton.tsx        ✅ 완료
    EmojiPicker.tsx                ✅ 완료
    FloatingEmojiContainer.tsx     ✅ 완료
    ImmersiveShareModal.tsx        ✅ 완료
```

---

## PRD 구현 현황

| PRD 항목 | 상태 |
|----------|------|
| 1-1 투표 남은 시간 (실시간 갱신) | ✅ |
| 1-2 본문 전체보기/접기 | ✅ |
| 1-3 A/B 투표 선택 + bar 애니메이션 (600ms ease-out) | ✅ |
| 1-3 실시간 비율 업데이트 (STOMP) | ✅ |
| 1-4 다음 투표 이동 (스와이프 업 / 휠 다운) | ✅ |
| 1-5 Live 토스트 (10명↑, 5초 노출, 60초 간격) | ✅ |
| 2. 이모지 반응 영역 (4종, 플로팅, 단일 선택) | ✅ |
| 3. 채팅 영역 (half/full/keyboard) | ❌ 미구현 (별도 스코프) |
| 4. 공유 링크 복사 + 토스트 | ✅ |
| 오류 토스트 (투표/이모지/공유 실패) | ✅ |
| 비회원 "n회 남았어요" 토스트 | ✅ |
| 비회원 5회 소진 팝업 | ✅ |
| 비회원 채팅 버튼 → 로그인 유도 | ✅ |
| 데이터 로딩 불가 → 에러 UI | ⬜ 컴포넌트 연결됨, UI 미완성 |

---

## 다음 작업 권장 순서

1. **`ImmersiveVoteErrorPage.tsx` UI 구현**
   - 에러 상태 디자인 적용 (현재 `return null`)

2. **채팅 기능 구현** (별도 스코프)
   - 채팅 API 명세 확인 후 별도 설계
   - 회원: 채팅 바텀시트 half/full/keyboard 상태
   - 비회원: 현재 `ChatAuthRequiredModal` 유지

3. **`mockImmersiveData.ts` 삭제**
   - 실제 API 연동 완료로 더 이상 사용되지 않음

---

## 신규 의존성

```bash
@stomp/stompjs@7.3.0  # STOMP WebSocket 클라이언트
```

WebSocket(STOMP)으로 `/topic/immersive-vote/{voteId}/live` 구독 → 실시간 투표 비율 및 뷰어 수 수신.
환경변수: `VITE_WS_BASE_URL` (예: `ws://localhost:8080`)

---

## 주요 타입 정의

```typescript
// src/features/immersive-vote/model/types.ts

export interface ImmersiveFeedItem {
  voteId: number;
  title: string;
  content: string;
  imageUrl: string | null;
  status: VoteStatus;
  endAt: string;
  participantCount: number;
  options: VoteOption[];
  myVote: { voted: boolean; selectedOptionId: number | null };
  emojiSummary: { LIKE: number; SAD: number; ANGRY: number; WOW: number; total: number };
  myEmoji: EmojiType | null;
  commentCount: number;
  currentViewerCount: number;
}

export interface ImmersiveParticipateResponse {
  voteId: number;
  action: "VOTED" | "CANCELED";
  selectedOptionId: number | null;
  options: VoteOption[];
  remainingFreeVotes: number | null;
}

// WebSocket 수신 페이로드
export interface ImmersiveLivePayload {
  options: Array<{ optionId: number; voteCount: number; ratio: number }>;
  currentViewerCount: number;
  totalParticipantCount: number;
}

export interface ImmersiveShareResponse {
  shareUrl: string;
  title: string;
  thumbnailUrl: string | null;
}
```

---

## 기존 코드 재사용 (import만)

| 컴포넌트/유틸 | 원본 경로 |
|---|---|
| `FreeVoteLimitModal` | `@features/votes/ui/FreeVoteLimitModal` |
| `ChatAuthRequiredModal` | `@features/votes/ui/ChatAuthRequiredModal` |
| `freeVotesQueryOptions`, `FreeVotesResponse` | `@features/votes/api/freeVotesQuery` |
| `EmojiType`, `VoteStatus`, `VoteOption`, `EmojiResponse` | `@features/votes/model/types` |
| `userQueryOptions` | `@features/auth/api/userQuery` |
| `BottomTabBar` | `@features/common/ui/BottomTabBar` |
| `showToast` | `@base/ui/Toast` |
| `Modal` | `@base/ui/Modal` |
| `DynamicBottomSheet` | `@base/ui/DynamicBottomSheet` |
| `apiClient` | `@base/api/client` |
| `stompClient` | `@base/api/stompClient` |

---

## 검증 방법

### 빌드/린트 검증
```bash
pnpm lint       # Biome 전체 통과
pnpm build      # tsc + vite build 에러 없음
```

### 기능 검증 (백엔드 연결 환경)

| 시나리오 | 기대 동작 |
|---|---|
| `/immersive-votes` 접근 | 카드 렌더링, 타이머 카운트다운 동작 |
| 옵션 클릭 (투표 전) | API 응답으로 ratio 표시 |
| 동일 옵션 재클릭 | CANCEL → 버튼 상태 복귀 |
| 다른 옵션 클릭 | 선택 변경 |
| STOMP 연결 후 다른 사용자 투표 | filled bar 실시간 업데이트 (600ms ease-out) |
| viewer count ≥ 10 수신 | "현재 N명이 참여중이에요!" 5초 토스트, 60초 간격 반복 |
| 이모지 버튼 클릭 | 말풍선 picker 오픈 |
| 이모지 선택 | 플로팅 애니메이션 3초, count 강조 |
| 같은 이모지 재클릭 | 선택 취소 |
| 공유 버튼 | ImmersiveShareModal 오픈, shareUrl 클립보드 복사 |
| 스와이프 업 | 다음 투표 카드 전환 |
| 비회원 5회 소진 | `FreeVoteLimitModal` 오픈 |
| 비회원 채팅 버튼 | `ChatAuthRequiredModal` 오픈 |
| 피드 API 실패 | `ImmersiveVoteErrorPage` 렌더링 |
