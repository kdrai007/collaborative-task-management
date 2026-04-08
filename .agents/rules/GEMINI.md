---
trigger: always_on
---

# GEMINI.md — Monorepo Root

## Project Overview
Real-time collaborative task manager. Monorepo with Turborepo + pnpm.
Frontend: React 19 + Vite. Backend: Fastify 5 + Socket.io. DB: MongoDB + Redis.

* IMPORTANT: Never touch .env files

---

## Scoped Rules — Read the Right File First
This root file contains **monorepo-wide** invariants only.
Before touching any package, **always read that package's own `GEMINI.md`**
for the full, authoritative rules for that scope.

| Package | Location | Scoped Rules |
|---------|----------|-------------|
| Frontend web app | `apps/web/` | `apps/web/GEMINI.md` |
| Backend API server | `apps/api/` | `apps/api/GEMINI.md` |
| Shared TypeScript types | `packages/types/` | `packages/types/GEMINI.md` |
| Shared editor primitive | `packages/editor/` | `packages/editor/GEMINI.md` |

> **Rule**: Never apply frontend rules inside `apps/api/` and vice versa.
> Each package's `GEMINI.md` explicitly lists what is off-limits from that scope.

---

## Cross-Package Architecture Invariants — NEVER violate these

1. **Single type source**: All shared TypeScript types live in
   `packages/types/src/index.ts` ONLY. Never define `Task`, `User`, or
   `Workspace` interfaces in `apps/web/` or `apps/api/`.

2. **Socket event name contract**: Event names must exactly match
   `ClientToServerEvents` and `ServerToClientEvents` in `@repo/types`.
   No hardcoded string literals on either side.

3. **LexoRank ordering**: Task/column order uses LexoRank strings.
   Never use integer indexes for position. This applies to both the DB
   schema and the frontend drag-and-drop logic.

4. **Socket DB writes**: All DB writes inside socket handlers must be
   `await`-ed and wrapped in `try/catch` with an ack callback on both
   success and error paths.

5. **Plugin registration order** (`apps/api/src/index.ts`): The Fastify
   plugin order is fixed. Auth must be registered before routes. Do not
   reorder or insert plugins without explicit approval.

6. **`turbo.json` is frozen**: Do not modify the Turborepo task dependency
   graph unless directly asked to.

---

## Monorepo Commands
```bash
pnpm dev                          # run everything (all packages)
pnpm --filter @repo/web dev       # frontend only
pnpm --filter @repo/server dev    # backend only (package name is @repo/server)
pnpm build                        # full build — types compiled first via turbo graph
pnpm test                         # run all tests
pnpm lint                         # lint all packages
docker-compose up -d              # start MongoDB + Redis (required for API)
```

---

## Code Conventions (applies everywhere)
- Named exports only — never default exports for controllers or components.
- Zod validation at every API boundary before any DB operation.
- Fastify route handlers return `{ success: true, data }` or `{ success: false, message }`.
- React components: one component per file, typed props interface.
- Zustand actions: never call the API directly — use React Query mutations.
- Socket emissions: always pass an ack callback, always handle the error case.

---

## Shared File Structure
| Artifact | Canonical Location |
|----------|--------------------|
| New API routes | `apps/api/src/routes/` |
| New controllers | `apps/api/src/controllers/` |
| New Mongoose models | `apps/api/src/models/` |
| New React pages | `apps/web/src/pages/` |
| New shared React hooks | `apps/web/src/hooks/` |
| New shared types / socket events | `packages/types/src/index.ts` |

---

## Testing
- **API unit/integration**: Vitest + Supertest → `apps/api/src/__tests__/`
- **E2E**: Playwright → `apps/web/e2e/`
- **RBAC rule**: Every protected endpoint must have one test per role:
  `viewer`, `member`, `admin`.
