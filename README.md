# JECT2-4th-Client

React 18 + Vite 기반 웹 클라이언트입니다.

## 스택

- **UI**: React, Tailwind CSS
- **라우팅**: TanStack Router (`src/pages/routes`)
- **데이터/폼**: TanStack Query, TanStack Form
- **품질**: TypeScript, Biome, Vitest
- **기타**: PWA, Sentry

## 요구 사항

- Node.js (LTS 권장)
- [pnpm](https://pnpm.io/)

## 시작하기

```bash
pnpm install
pnpm dev
```

개발 서버는 기본적으로 `http://localhost:3000` 입니다.

## 자주 쓰는 명령

| 명령 | 설명 |
|------|------|
| `pnpm dev` | 개발 서버 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm preview` | 빌드 결과 미리보기 |
| `pnpm lint` | Biome 검사/자동 수정 |
| `pnpm test` | Vitest 실행 |

## 경로 별칭

Vite에서 `@`, `@app`, `@pages`, `@layouts`, `@features`, `@base` 등으로 `src` 하위를 import 할 수 있습니다.
