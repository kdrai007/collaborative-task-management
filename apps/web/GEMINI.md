# GEMINI.md — @repo/web (Frontend)

## Scope
Rules in this file apply **only** to `apps/web/`. Do NOT apply these rules
to `apps/api/` or any `packages/`. If you need to touch shared types, edit
`packages/types/src/index.ts` exclusively — never define types locally.

---

## Tech Stack
- **Framework**: React 19 + Vite 8
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v3 with Material Design 3 color tokens
- **Icons**: `lucide-react`
- **State**: Zustand (for global UI state)
- **Server state**: React Query (TanStack Query) — all data fetching goes here
- **Real-time**: Socket.io client — only emit/listen via dedicated hooks
- **Shared types**: `@repo/types` — import, never redefine

---

## File Structure — Where New Code Goes
| What | Where |
|------|-------|
| New pages | `apps/web/src/pages/` |
| New shared hooks | `apps/web/src/hooks/` |
| New components | `apps/web/src/components/` |
| Drag-and-drop logic | `apps/web/src/hooks/useDragDrop.ts` |
| Socket listeners | `apps/web/src/hooks/useSocket.ts` |
| API calls | `apps/web/src/lib/api.ts` — never call fetch directly in components |
| Global store | `apps/web/src/stores/` (Zustand) |

---

## Component Rules
- One component per file, **named export** (no default exports).
- Props must be typed with an explicit interface — no `any`.
- Never import from `apps/api/` or `packages/editor/src/` internals.
- Use `@repo/types` for Task, User, Workspace, socket event shapes.

```tsx
// ✅ Correct
export interface TaskCardProps {
  task: Task; // from @repo/types
}
export function TaskCard({ task }: TaskCardProps) { ... }

// ❌ Wrong — local type, default export
export default function TaskCard({ task }: { task: any }) { ... }
```

---

## Styling Rules — Material Design 3 Token System
The project uses a **custom MD3 Tailwind palette**. Always use semantic tokens.

| Use | Token example |
|-----|--------------|
| Page background | `bg-background` |
| Card surface | `bg-surface-container-lowest` |
| Elevated container | `bg-surface-container` / `bg-surface-container-high` |
| Primary action | `bg-primary`, `text-on-primary` |
| Error / High-priority | `bg-error-container`, `text-on-error-container` |
| Secondary label | `bg-secondary-container`, `text-on-secondary-container` |
| Body text | `text-on-background` |

**Do NOT** use raw Tailwind color names like `bg-blue-500`, `text-gray-700`,
or `bg-white` for structural elements. Use the MD3 tokens above.

**No 1px solid borders** for structural separation — use background tonal
shifts instead (e.g., `bg-surface-container-low` → `bg-surface-container`).
Borders (e.g., `border-outline-variant/15`) are only for interactive focus
rings or card dividers in review states.

---

## State Management Rules
- **Zustand**: UI state only (sidebar open, modal open, selected task id).
  Never call the API directly from a Zustand action.
- **React Query**: All API data fetching and mutations.
- **Socket.io**: Handled via custom hooks in `src/hooks/`. Never call
  `socket.emit()` directly inside a component — wrap in a hook.

```ts
// ✅ Correct — Zustand action is pure UI mutation
const useUIStore = create((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
}));
```

---

## Drag-and-Drop (LexoRank)
- Task order is determined by **LexoRank strings** — never by integer index.
- When reordering, compute a new LexoRank between neighboring tasks.
- Persist via a React Query mutation (optimistic update + server sync).
- Never mutate the order array directly in a Zustand store.

---

## Socket Events
- Use **only** the event names defined in `ServerToClientEvents` and
  `ClientToServerEvents` in `@repo/types`. Never hardcode strings.
- Always pass an ack callback and handle the error case.

```ts
// ✅ Correct
socket.emit('task:move', payload, (res) => {
  if (!res.success) console.error(res.message);
});

// ❌ Wrong — hardcoded string, no ack
socket.emit('moveTask', payload);
```

---

## What NOT to Touch from apps/web
- `apps/api/src/**` — backend is off-limits
- `packages/types/src/index.ts` — only add, never rename or restructure
- `turbo.json` at the repo root — do not touch
- `apps/api/src/index.ts` plugin registration order

---

## Commands (run from repo root)
```bash
pnpm --filter @repo/web dev    # Start frontend dev server
pnpm --filter @repo/web build  # Build frontend
pnpm --filter @repo/web lint   # Lint frontend
```
