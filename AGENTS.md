# Repository Guidelines

## Project Structure & Module Organization

This React 18 + Vite TypeScript client uses a customized Feature-Sliced Design.

- `src/app`: application setup, providers, router config, global styles, Sentry, Query Client.
- `src/pages/routes`: TanStack Router file-based routes. Do not edit `src/app/config/routeTree.gen.ts` manually.
- `src/features`: domain features such as `home`, `auth`, and `votes`, split into segments like `ui/`, `api/`, `model/`, `hooks/`, and `types/`.
- `src/base`: reusable UI and infrastructure such as API client, modals, toast, charts, and shared widgets.
- `src/docs`: architecture notes and API specs.
- `public`: static assets and PWA fallback files.

Use aliases from Vite/Vitest: `@`, `@app`, `@pages`, `@features`, `@base`, and `@layouts`.

## Build, Test, and Development Commands

- `pnpm install`: install dependencies with pinned `pnpm@10.10.0`.
- `pnpm dev`: start the Vite dev server at `http://localhost:3000`.
- `pnpm build`: run TypeScript build checks and create a production bundle.
- `pnpm build:staging`: build with Vite staging mode.
- `pnpm preview`: serve the built output locally.
- `pnpm lint`: run Biome checks and auto-fixes.
- `pnpm format`: format files with Biome.
- `pnpm test`: run Vitest once.
- `pnpm test:watch`: run Vitest in watch mode.

## Coding Style & Naming Conventions

Biome enforces 2-space indentation, double quotes, organized imports, and a 120-character line width. Keep generated files untouched, especially `*.gen.ts`.

Components and pages use PascalCase, for example `VoteDetailPage.tsx` and `FreeVoteLimitModal.tsx`. Hooks use `useSomething.ts`. Tests live beside implementation as `*.test.ts` or `*.test.tsx`.

Follow the layer dependency direction: upper layers may import lower layers, but lower layers must not import upper layers.

## Testing Guidelines

Vitest runs in `jsdom` and includes `src/**/*.test.{ts,tsx}`. Prefer focused tests for model logic and hooks, as in `src/features/votes/model/`. Use Testing Library for component or hook behavior. Run a single file with:

```bash
pnpm vitest run src/features/votes/model/useVoteDetail.test.tsx
```

## Commit & Pull Request Guidelines

Recent commits use concise Conventional Commit prefixes such as `feat:`, `test:`, and `chore:`. Keep the subject imperative and scoped to the actual change, for example `feat: add vote sharing modal`.

Pull requests should include a summary, test results, linked issue or task when available, and screenshots or recordings for visible UI changes. Note route, API contract, environment, or PWA changes explicitly.

## Security & Configuration Tips

Do not commit secrets or local environment files. Keep API contracts synchronized with `src/docs/api-spec/`. For routing, regenerate route artifacts through the existing TanStack Router workflow instead of editing generated files by hand.
