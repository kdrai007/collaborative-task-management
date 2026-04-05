# GEMINI.md — @repo/types (Shared Type Contract)

## Scope
Rules in this file apply **only** to `packages/types/`. This package is the
**single source of truth** for all shared TypeScript types across the monorepo.

---

## The Golden Rule
> **Only add. Never rename. Never remove.**

Other packages (`@repo/web`, `@repo/server`) import these types directly.
Renaming or removing any exported interface/type is a **breaking change**
that will cause type errors across both apps simultaneously.

---

## What Belongs Here
- `Task`, `User`, `Workspace`, `Column`, `Comment` — domain entity interfaces
- `ClientToServerEvents` — Socket.io events the client sends to the server
- `ServerToClientEvents` — Socket.io events the server broadcasts to clients
- Any enum or union type shared between frontend and backend
- Ack response shapes (e.g., `SocketAck<T>`)

## What Does NOT Belong Here
- React component prop types → stay in `apps/web/src/`
- Fastify request/reply types → stay in `apps/api/src/`
- Zod schemas → stay in `apps/api/src/` (Zod is a backend devDep only)
- Business logic or utility functions

---

## File Structure
All exports live in a **single file**:

```
packages/types/src/index.ts   ← the only file; never split into multiple modules
```

---

## Editing Rules
1. Add new interfaces at the **bottom** of the file. Do not reorder existing exports.
2. Use `readonly` for fields that should never be mutated client-side.
3. Prefer `interface` over `type` aliases for object shapes.
4. Socket event interfaces must follow this pattern exactly:

```ts
// ✅ Correct pattern for socket events
export interface ClientToServerEvents {
  'task:move': (payload: MoveTaskPayload, ack: SocketAck<Task>) => void;
}

export interface ServerToClientEvents {
  'task:updated': (task: Task) => void;
}

export type SocketAck<T> = (res: { success: true; data: T } | { success: false; message: string }) => void;
```

---

## No Dependencies Policy
`@repo/types` has **zero runtime dependencies**. Do not add any.
Only TypeScript devDependencies are allowed.

---

## After Editing
Run from the repo root to verify no type breakage across all apps:
```bash
pnpm build         # builds types first (turbo dependency graph)
pnpm --filter @repo/web lint
pnpm --filter @repo/server lint
```
