// =============================================================================
// @repo/types — Single source of truth for all shared types across the monorepo.
// RULE: Add-only. Never rename or remove an existing export.
//       Both apps/web and apps/api import from here.
// =============================================================================

// ---------------------------------------------------------------------------
// Roles & Enums
// ---------------------------------------------------------------------------

/** The three permission tiers inside a workspace. */
export type WorkspaceRole = 'admin' | 'member' | 'viewer';

/** Visual priority of a task — stored as a string enum in MongoDB. */
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/** Kanban lifecycle stages. Maps 1-to-1 with Column documents. */
export type TaskStatus = 'open' | 'in_progress' | 'in_review' | 'done';

// ---------------------------------------------------------------------------
// Domain entities
// All `id` fields are the MongoDB _id converted to string via toJSON transform.
// All date fields are ISO-8601 strings (serialised from Date objects).
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface WorkspaceMember {
  userId: string;
  role: WorkspaceRole;
  joinedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: WorkspaceMember[];
  createdAt: string;
}

export interface Column {
  id: string;
  workspaceId: string;
  title: string;
  /** LexoRank string — NEVER an integer index. */
  order: string;
  createdAt: string;
}

export interface Task {
  id: string;
  workspaceId: string;
  columnId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeId: string | null;
  dueDate: string | null;
  /** LexoRank string — NEVER an integer index. */
  order: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  body: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Socket payload shapes
// ---------------------------------------------------------------------------

/** Payload for moving a task between columns or within a column. */
export interface MoveTaskPayload {
  taskId: string;
  targetColumnId: string;
  /** LexoRank of the item immediately above the drop target. null = insert at top. */
  beforeOrder: string | null;
  /** LexoRank of the item immediately below the drop target. null = insert at bottom. */
  afterOrder: string | null;
}

/** Payload for reordering a column within a workspace. */
export interface ReorderColumnsPayload {
  workspaceId: string;
  columnId: string;
  beforeOrder: string | null;
  afterOrder: string | null;
}

/** Payload for broadcasting live cursor position. Fire-and-forget — no ack. */
export interface CursorMovePayload {
  workspaceId: string;
  /** null when the cursor leaves a task card. */
  taskId: string | null;
  x: number;
  y: number;
}

// ---------------------------------------------------------------------------
// Socket ack — discriminated union used on every ack callback.
// ---------------------------------------------------------------------------

export type SocketAck<T> =
  | { success: true; data: T }
  | { success: false; message: string };

// ---------------------------------------------------------------------------
// Socket.io event maps
// RULE: These are the ONLY valid event name strings in the codebase.
//       Never hardcode the string literals on the client or server side.
// ---------------------------------------------------------------------------

export interface ClientToServerEvents {
  /** Join a workspace room to receive real-time updates. */
  'workspace:join': (
    payload: { workspaceId: string },
    ack: (res: SocketAck<void>) => void,
  ) => void;

  /** Leave a workspace room. */
  'workspace:leave': (
    payload: { workspaceId: string },
    ack: (res: SocketAck<void>) => void,
  ) => void;

  /** Create a new task — server assigns id, order, timestamps. */
  'task:create': (
    payload: Omit<Task, 'id' | 'order' | 'createdAt' | 'updatedAt' | 'status'>,
    ack: (res: SocketAck<Task>) => void,
  ) => void;

  /** Move a task to a new column / position using LexoRank. */
  'task:move': (
    payload: MoveTaskPayload,
    ack: (res: SocketAck<Task>) => void,
  ) => void;

  /** Patch one or more editable fields of a task. */
  'task:update': (
    payload: {
      taskId: string;
      changes: Partial<
        Pick<Task, 'title' | 'description' | 'priority' | 'status' | 'assigneeId' | 'dueDate'>
      >;
    },
    ack: (res: SocketAck<Task>) => void,
  ) => void;

  /** Permanently delete a task. */
  'task:delete': (
    payload: { taskId: string },
    ack: (res: SocketAck<void>) => void,
  ) => void;

  /** Reorder a column via LexoRank. */
  'column:reorder': (
    payload: ReorderColumnsPayload,
    ack: (res: SocketAck<Column>) => void,
  ) => void;

  /** Broadcast cursor position — fire-and-forget, no ack needed. */
  'cursor:move': (payload: CursorMovePayload) => void;
}

export interface ServerToClientEvents {
  'task:created':     (task: Task) => void;
  'task:moved':       (task: Task) => void;
  'task:updated':     (task: Task) => void;
  'task:deleted':     (payload: { taskId: string }) => void;
  'column:reordered': (column: Column) => void;
  /** Cursor update broadcast includes the userId of the mover. */
  'cursor:updated':   (payload: CursorMovePayload & { userId: string }) => void;
}

/** Per-socket server-side data attached by the auth middleware. */
export interface SocketData {
  userId: string;
  email: string;
}