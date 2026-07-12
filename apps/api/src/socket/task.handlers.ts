// =============================================================================
// socket/task.handlers.ts — Real-time task event handlers
//
// Every handler: awaits DB writes, wraps in try/catch, calls ack on both paths.
// Event names come from @repo/types — never hardcoded strings.
// =============================================================================

import type { Server, Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, SocketData } from '@repo/types';
import { TaskOperations } from '../domain/TaskOperations.js';

type IO  = Server<ClientToServerEvents, ServerToClientEvents, Record<string,never>, SocketData>;
type Soc = Socket<ClientToServerEvents, ServerToClientEvents, Record<string,never>, SocketData>;

export function registerTaskHandlers(io: IO, socket: Soc): void {

  // ---------------------------------------------------------------------------
  // task:create — create a new task and broadcast to the workspace room
  // ---------------------------------------------------------------------------
  socket.on('task:create', async (payload, ack) => {
    try {
      const result = await TaskOperations.createTask({
        workspaceId: payload.workspaceId,
        columnId: payload.columnId,
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        assigneeId: payload.assigneeId,
        dueDate: payload.dueDate,
      });

      // Broadcast to everyone in the workspace room (including the sender)
      io.to(payload.workspaceId).emit('task:created', result.data);

      ack({ success: true, data: result.data });
    } catch (err) {
      ack({ success: false, message: (err as Error).message });
    }
  });

  // ---------------------------------------------------------------------------
  // task:move — update a task's column and LexoRank order, broadcast result
  // ---------------------------------------------------------------------------
  socket.on('task:move', async (payload, ack) => {
    try {
      const result = await TaskOperations.moveTask({
        taskId: payload.taskId,
        targetColumnId: payload.targetColumnId,
        beforeOrder: payload.beforeOrder,
        afterOrder: payload.afterOrder,
      });

      // Broadcast so all connected clients update their board state
      io.to(result.data.workspaceId).emit('task:moved', result.data);

      ack({ success: true, data: result.data });
    } catch (err) {
      ack({ success: false, message: (err as Error).message });
    }
  });

  // ---------------------------------------------------------------------------
  // task:update — patch editable fields and broadcast
  // ---------------------------------------------------------------------------
  socket.on('task:update', async (payload, ack) => {
    try {
      const result = await TaskOperations.updateTask({
        taskId: payload.taskId,
        changes: payload.changes,
      });

      io.to(result.data.workspaceId).emit('task:updated', result.data);

      ack({ success: true, data: result.data });
    } catch (err) {
      ack({ success: false, message: (err as Error).message });
    }
  });

  // ---------------------------------------------------------------------------
  // task:delete — cascade-delete task + its comments, broadcast tombstone
  // ---------------------------------------------------------------------------
  socket.on('task:delete', async (payload, ack) => {
    try {
      const result = await TaskOperations.deleteTask({
        taskId: payload.taskId,
      });

      io.to(result.data.workspaceId).emit('task:deleted', { taskId: payload.taskId });

      ack({ success: true, data: undefined });
    } catch (err) {
      ack({ success: false, message: (err as Error).message });
    }
  });
}

