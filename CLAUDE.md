# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Dev server at http://localhost:3000
pnpm build        # Production build (tsc -b && vite build)
pnpm lint         # Biome check + auto-fix
pnpm test         # Vitest (single run)
pnpm test:watch   # Vitest (watch mode)
```

Run a single test file: `pnpm vitest run src/path/to/file.test.ts`

## Architecture: Feature-Sliced Design (FSD)

The project follows a customized FSD architecture. Layer names must not be renamed.

### Layers (top-down dependency order)

| Layer | Alias | Purpose |
|-------|-------|---------|
| `src/app` | `@app` | Project-only global config, providers, root layout |
| `src/pages` | `@pages` | Route-level pages; integrates features and layouts |
| `src/layouts` | `@layouts` | Composite UI widgets (Header, Footer, etc.) |
| `src/features` | `@features` | Domain features with business logic and state |
| `src/base` | `@base` | Cross-project reusable components and utilities |

Upper layers can import from lower layers; lower layers must never import from upper layers.

### Segments (used within each layer)

- **`ui/`** — `.tsx` files only; pure UI and interactive components
- **`api/`** — Server calls, TanStack Query hooks, server state sync
- **`model/`** — Business logic: types, pure functions, custom hooks
- **`lib/`** — Domain-agnostic utility functions (e.g. `formatDate`)
- **`config/`** — Constants and env vars only; no logic

### Routing

TanStack Router with file-based routing. Route files live in `src/pages/routes/`. The route tree is auto-generated to `src/app/config/routeTree.gen.ts` — never edit this file manually. The router uses `queryClient` as context, enabling route-level data preloading.

### App entry

`src/main.tsx` → `src/app/App.tsx` wraps the app in: `Sentry.ErrorBoundary` → `HelmetProvider` → `QueryClientProvider` → `RouterProvider`. `PushNotificationBridge` and `Toast` (Sonner) are injected globally inside the router.

## Docs

- [FSD Architecture Guide](src/docs/architecture/fsd.md)
- [Auth API](src/docs/api-spec/auth.md)
- [Vote API](src/docs/api-spec/vote.md)

## Key conventions

- **Package manager**: `pnpm` only
- **Linter/formatter**: Biome (`biome.json`). Double quotes, 2-space indent, 120 char line width. Runs on save via `pnpm lint`.
- **`*.gen.ts` files** are Biome-ignored and auto-generated — don't edit.
- Start new features/pages in `pages/` with `ui`, `model`, `api` segments. Extract to `features/` only when a clear domain pattern emerges across multiple pages.
- Place something in `base/` only if it could be reused across different projects; otherwise use `app/`.
