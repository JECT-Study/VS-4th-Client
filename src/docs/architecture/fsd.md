# Feature-Sliced Design (FSD) 아키텍처 가이드

## 팀 컨벤션

1. `Layer`와 `Segment` 이름은 변형하거나 축약하지 않고 그대로 사용한다.
2. 경계가 애매하면 적용하지 않는 것이 낫다.
3. 초반에는 `pages/ui`, `pages/model`, `pages/api` 조합으로 시작하고, 도메인 패턴이 반복되면 `features`로 분리한다.
4. `base`는 타 프로젝트에서도 재사용 가능한 경우에만 사용한다. 프로젝트 전용이면 `app`에 둔다.

---

## Layer 구조

레이어는 아래 순서대로 의존한다. 상위 레이어는 하위 레이어를 import할 수 있지만, 반대 방향은 금지한다.

```
app → pages → layouts → features → base
```

### `app`

> 프로젝트 내부에서만 사용되는 전역 설정 및 공통 컴포넌트

| Segment | 용도 | 예시 |
|---------|------|------|
| `ui` | 전역 레이아웃 / 테마 UI | `AppLayout` |
| `api` | 프로젝트 전용 초기 API 설정 | `initApiClient` |
| `model` | 전역 상태 관리 훅, 공통 타입 | `useAppState` |
| `lib` | 프로젝트 전용 유틸리티 | `initializeApp` |
| `config` | 전역 상수 및 환경 설정 | `APP_NAME`, `DEFAULT_LANGUAGE` |

### `base` (= shared)

> 여러 프로젝트에서 재사용 가능한 범용 컴포넌트 및 유틸리티

| Segment | 용도 | 예시 |
|---------|------|------|
| `ui` | 범용 재사용 UI 컴포넌트 | `Button`, `Modal`, `FormField` |
| `api` | 공통 API 설정 및 유틸리티 | Axios 인스턴스 설정 |
| `model` | 공통 기능 훅 | `useAuth` |
| `lib` | 도메인 무관 순수 유틸리티 함수 | `formatDate`, `deepClone` |
| `config` | 전역 상수 | 반응형 브레이크포인트, 색상 토큰 |

### `features` (entities 개념 포함)

> 특정 사용자 행동 및 비즈니스 로직 단위

| Segment | 용도 | 예시 |
|---------|------|------|
| `ui` | 주요 행동을 구현하는 컴포넌트 | `AddToCartButton` |
| `api` | 기능별 API 호출 (TanStack Query) | `useAddToCart` |
| `model` | 비즈니스 로직 커스텀 훅 | `useCartState` |
| `lib` | 기능 관련 유틸리티 | — |
| `config` | 기능별 상수 및 설정값 | — |

### `layouts` (= widgets)

> 여러 기능/UI 요소를 조합한 독립적인 복합 컴포넌트

| Segment | 용도 | 예시 |
|---------|------|------|
| `ui` | UI 요소 조합 컴포넌트 | `Header`, `Footer`, `DashboardWidget` |
| `api` | 위젯 전용 데이터 페칭 | `fetchWidgetData` |
| `model` | 데이터 집계 로직 (드물게 사용) | — |
| `lib` | 위젯 전용 유틸리티 | — |
| `config` | 위젯 동작 관련 설정 | — |

### `pages`

> 라우트 단위 페이지 레이아웃 및 로직

| Segment | 용도 | 예시 |
|---------|------|------|
| `ui` | 페이지 레이아웃 및 콘텐츠 구조 | `MainPage`, `ServicePage` |
| `api` | 페이지 전용 API 호출 | `useFetchHomePageData` |
| `model` | 라우트 처리 및 페이지별 데이터 타입 | — |
| `lib` | 페이지 동작 유틸리티 | — |
| `config` | 페이지 관련 설정값 | — |

---

## Segment 정의

### `api`

서버와의 모든 통신 관련 코드.

- 단일 리소스 CRUD API 호출
- 여러 엔드포인트를 조합한 복합 API 요청
- 캐싱 및 낙관적 업데이트를 포함한 서버 상태 동기화
- 다단계 API 흐름 및 에러 처리

### `ui`

`.tsx` 파일만 포함. 시각적 표현 담당.

- 스타일과 레이아웃만 담당하는 순수 UI 컴포넌트
- 도메인 데이터를 표시하는 읽기 전용 컴포넌트
- 상태 관리 및 사용자 액션을 처리하는 인터랙티브 컴포넌트
- 여러 컴포넌트를 조합한 독립적 UI 블록
- 페이지와 레이아웃을 구성하는 최상위 컴포넌트

### `model`

비즈니스 로직이 포함된 코드.

- 도메인 타입 및 인터페이스 정의
- 순수한 도메인 계산 및 변환 함수
- 상태 관리 및 사이드이펙트를 처리하는 커스텀 훅
- 복잡한 비즈니스 규칙 및 다단계 도메인 로직

### `lib`

비즈니스 도메인에 종속되지 않는 유틸리티 함수.

- 기본 데이터 타입 처리 순수 함수 (예: `formatDate`)
- 도메인 특화 데이터 처리 헬퍼 함수
- 유효성 검사 및 에러 처리 로직
- 다단계 데이터 처리 파이프라인 유틸리티

### `config`

동작 없이 값만 선언하는 상수 모음.

- 기본 상수값 및 열거형(enum) 정의
- 환경별 설정값 및 환경 변수
- 도메인별 규칙 및 제약 조건
- 조건부/동적 설정 포함 고급 설정 관리
