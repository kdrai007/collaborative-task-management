# GEMINI.md — @repo/server (Backend API)

## Scope
Rules in this file apply **only** to `apps/api/`. Do NOT apply these rules
to `apps/web/` or `packages/`. Shared TypeScript types must always come from
`packages/types/src/index.ts` — never redefine Task, User, or Workspace here.

---

## Tech Stack
- **Runtime**: Node.js ≥ 20, TypeScript 6 (strict)
- **HTTP server**: Fastify v5
- **Real-time**: Socket.io v4 with `@socket.io/redis-adapter`
- **Database**: MongoDB via Mongoose v9
- **Cache / Pub-Sub**: Redis v5 (`ioredis` compatible)
- **Auth**: `@fastify/jwt` + `@fastify/cookie`
- **Validation**: Zod v4 — mandatory at every API boundary
- **Dev runner**: `tsx watch`
- **Testing**: Vitest

---

## File Structure — Where New Code Goes
| What | Where |
|------|-------|
| New routes | `apps/api/src/routes/` |
| New controllers | `apps/api/src/controllers/` |
| New Mongoose models | `apps/api/src/models/` |
| Socket event handlers | `apps/api/src/socket/` |
| Middleware / plugins | `apps/api/src/plugins/` |
| Utility helpers | `apps/api/src/lib/` |
| Tests | `apps/api/src/__tests__/` |

---

## Plugin Registration Order — DO NOT CHANGE
`apps/api/src/index.ts` registers plugins in a specific order.
**Never reorder** the plugin list. Auth must be registered before routes.

```
helmet → cors → cookie → jwt → rate-limit → auth-decorator → routes → socket
```

---

## Route Handler Contract
Every Fastify route handler must:
1. Validate the request body/params/query with a **Zod schema** before
   touching the DB.
2. Return `{ success: true, data: ... }` on success.
3. Return `{ success: false, message: string }` on every error path.
4. Be a **named export** — never a default export.

```ts
// ✅ Correct
const bodySchema = z.object({ title: z.string().min(1) });

export async function createTask(req: FastifyRequest, rep: FastifyReply) {
  const body = bodySchema.parse(req.body); // throws on invalid
  const task = await Task.create(body);
  return rep.send({ success: true, data: task });
}

// ❌ Wrong — no validation, default export, wrong response shape
export default async function (req, rep) {
  const task = await Task.create(req.body);
  rep.send(task);
}
```

---

## Socket Event Rules
- Event names must exactly match `ClientToServerEvents` and
  `ServerToClientEvents` in `@repo/types`. Never hardcode strings.
- Every socket handler must:
  - **Await** all DB writes.
  - Wrap everything in **try/catch**.
  - Call the **ack callback** on both success and error.

```ts
// ✅ Correct
socket.on('task:move', async (payload, ack) => {
  try {
    const result = await moveTask(payload);
    ack({ success: true, data: result });
  } catch (err) {
    ack({ success: false, message: (err as Error).message });
  }
});
```

---

## Database / Mongoose Rules
- Define models **only** in `apps/api/src/models/`.
- Always use lean() for read-only queries to avoid Mongoose overhead.
- Document interfaces must extend types from `@repo/types` where applicable.
- Never use `findOneAndUpdate` without `{ new: true, runValidators: true }`.

```ts
// ✅ Correct — lean read, validator options
const task = await TaskModel.findByIdAndUpdate(
  id,
  { status: 'done' },
  { new: true, runValidators: true }
).lean();
```

---

## Authentication & RBAC
- Protect routes with the auth decorator, defined in `apps/api/src/plugins/`.
- Every RBAC-sensitive endpoint must test all three roles: **viewer, member, admin**.
- Never trust `req.body.userId` — always derive the user from `req.user`
  (JWT payload decoded by `@fastify/jwt`).

---

## Drag-and-Drop Order (LexoRank)
- Task order is stored as **LexoRank strings** in the DB, never integers.
- When a reorder event arrives via socket, compute the new LexoRank
  on the server and persist to MongoDB before broadcasting.

---

## Testing Rules
- Test files live in `apps/api/src/__tests__/`.
- Use **Vitest** + Supertest for route tests.
- **Always write one test per role** (viewer, member, admin) for any
  RBAC-protected endpoint.
- Mock MongoDB using `mongodb-memory-server` or `@repo/types` fixtures.

---

## What NOT to Touch from apps/api
- `apps/web/src/**` — frontend is off-limits
- `packages/types/src/index.ts` — only add, never rename or restructure
- `apps/api/src/index.ts` plugin registration order
- `turbo.json` at the repo root

---

## Commands (run from repo root)
```bash
pnpm --filter @repo/server dev    # Start API in watch mode
pnpm --filter @repo/server build  # Compile TypeScript
pnpm --filter @repo/server test   # Run Vitest
pnpm --filter @repo/server lint   # Type-check (tsc --noEmit)
docker-compose up -d              # Start MongoDB + Redis
```
