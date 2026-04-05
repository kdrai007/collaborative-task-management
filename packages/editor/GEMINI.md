# GEMINI.md — @repo/editor (Shared Editor Package)

## Scope
Rules in this file apply **only** to `packages/editor/`. This package provides
a shared rich-text editor primitive consumed by `@repo/web`.

---

## Purpose
`@repo/editor` exports a framework-agnostic, reusable editor component/hook.
It must have **no React dependency** unless explicitly declared in its own
`package.json` — it currently has zero runtime dependencies.

---

## Rules
1. **No direct imports from `apps/`** — this package must never import from
   `apps/web/` or `apps/api/`. It may import from `@repo/types`.
2. **No side effects** — exports must be pure functions or classes.
3. The entry point is `packages/editor/src/index.ts`. All public API
   exports must flow through that file.
4. Any new exports must be backward-compatible — do not remove or rename
   existing exports (they may be consumed by `apps/web`).

---

## What NOT to touch
- `turbo.json` at the repo root
- `packages/types/src/index.ts` — use as-is, don't modify from here
- `apps/web/src/**` or `apps/api/src/**`

---

## Commands
```bash
pnpm --filter @repo/editor lint   # Type-check only
```
