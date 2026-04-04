---
trigger: always_on
---

# GEMINI.md

## Project Overview
Real-time collaborative task manager. Monorepo with Turborepo + pnpm.
Frontend: React + Vite. Backend: Fastify + Socket.io. DB: MongoDB + Redis.

## Architecture Rules — NEVER violate these
- All shared TypeScript types live in `packages/types/src/index.ts` ONLY.
  Never define Task, User, Workspace interfaces anywhere else.
- Socket event names must match `ClientToServerEvents` and
  `ServerToClientEvents` in `@repo/types` exactly.
- Drag-and-drop order uses LexoRank strings. Never use integer indexes.
- All DB writes in socket handlers must be awaited and wrapped in try/catch
  with an ack callback returned on both success and error.

## Commands
```bash
pnpm dev              # run everything
pnpm --filter @repo/api dev    # API only
pnpm --filter @repo/web dev    # Web only
pnpm build            # full build (types first, then apps)
pnpm test             # run all tests
docker-compose up -d  # start MongoDB + Redis
```

## Code Conventions
- Controllers: named exports, never default exports
- Zod validation at every API boundary before touching the DB
- Fastify route handlers: always return `{ success, data }` or `{ success, message }`
- React components: one component per file, named export
- Zustand actions: never call API directly — use React Query mutations
- Socket emissions: always pass an ack callback, always handle the error case

## File Structure
- New API routes → `apps/api/src/routes/`
- New controllers → `apps/api/src/controllers/`
- New models → `apps/api/src/models/`
- New React pages → `apps/web/src/pages/`
- New shared hooks → `apps/web/src/hooks/`
- New shared types → `packages/types/src/index.ts` (extend existing file)

## What NOT to touch
- `packages/types/src/index.ts` structure — only add, never rename exports
- `apps/api/src/index.ts` plugin registration order (auth before routes)
- `turbo.json` task dependency graph

## Testing
- API: Vitest + Supertest. Test files in `apps/api/src/__tests__/`
- E2E: Playwright. Test files in `apps/web/e2e/`
- Always test RBAC: write one test per role (viewer, member, admin)