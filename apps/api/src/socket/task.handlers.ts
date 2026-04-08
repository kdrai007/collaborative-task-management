// =============================================================================
// socket/task.handlers.ts — Real-time task event handlers
//
// Every handler: awaits DB writes, wraps in try/catch, calls ack on both paths.
// Event names come from @repo/types — never hardcoded strings.
// =============================================================================

import type { Server, Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, SocketData, Task } from '@repo/types';
import { TaskModel }    from '../models/Task.js';
import { CommentModel } from '../models/Comment.js';
import { midRank, INITIAL_RANK } from '../lib/lexorank.js';

type IO  = Server<ClientToServerEvents, ServerToClientEvents, Record<string,never>, SocketData>;
type Soc = Socket<ClientToServerEvents, ServerToClientEvents, Record<string,never>, SocketData>;

export function registerTaskHandlers(io: IO, socket: Soc): void {

  // ---------------------------------------------------------------------------
  // task:create — create a new task and broadcast to the workspace room
  // ---------------------------------------------------------------------------
  socket.on('task:create', async (payload, ack) => {
    try {
      // Place the new task at the end of the target column
      const last = await TaskModel
        .findOne({ columnId: payload.columnId })
        .sort({ order: -1 })
        .lean();

      const order = last ? last.order + INITIAL_RANK : INITIAL_RANK;

      const task = await TaskModel.create({
        workspaceId: payload.workspaceId,
        columnId:    payload.columnId,
        title:       payload.title,
        description: payload.description ?? '',
        priority:    payload.priority ?? 'medium',
        assigneeId:  payload.assigneeId ?? null,
        dueDate:     payload.dueDate ?? null,
        order,
      });

      const taskJSON = task.toJSON() as unknown as Task;

      // Broadcast to everyone in the workspace room (including the sender)
      io.to(payload.workspaceId).emit('task:created', taskJSON);

      ack({ success: true, data: taskJSON });
    } catch (err) {
      ack({ success: false, message: (err as Error).message });
    }
  });

  // ---------------------------------------------------------------------------
  // task:move — update a task's column and LexoRank order, broadcast result
  // ---------------------------------------------------------------------------
  socket.on('task:move', async (payload, ack) => {
    try {
      // Compute the new LexoRank between the two surrounding items
      const newOrder = midRank(payload.beforeOrder, payload.afterOrder);

      const task = await TaskModel.findByIdAndUpdate(
        payload.taskId,
        { $set: { columnId: payload.targetColumnId, order: newOrder } },
        { returnDocument: 'after', runValidators: true },
      );

      if (!task) {
        ack({ success: false, message: 'Task not found' });
        return;
      }

      const taskJSON = task.toJSON() as unknown as Task;

      // Broadcast so all connected clients update their board state
      io.to(taskJSON.workspaceId).emit('task:moved', taskJSON);

      ack({ success: true, data: taskJSON });
    } catch (err) {
      ack({ success: false, message: (err as Error).message });
    }
  });

  // ---------------------------------------------------------------------------
  // task:update — patch editable fields and broadcast
  // ---------------------------------------------------------------------------
  socket.on('task:update', async (payload, ack) => {
    try {
      const task = await TaskModel.findByIdAndUpdate(
        payload.taskId,
        { $set: payload.changes },
        { returnDocument: 'after', runValidators: true },
      );

      if (!task) {
        ack({ success: false, message: 'Task not found' });
        return;
      }

      const taskJSON = task.toJSON() as unknown as Task;
      io.to(taskJSON.workspaceId).emit('task:updated', taskJSON);

      ack({ success: true, data: taskJSON });
    } catch (err) {
      ack({ success: false, message: (err as Error).message });
    }
  });

  // ---------------------------------------------------------------------------
  // task:delete — cascade-delete task + its comments, broadcast tombstone
  // ---------------------------------------------------------------------------
  socket.on('task:delete', async (payload, ack) => {
    try {
      const task = await TaskModel.findById(payload.taskId).lean();
      if (!task) {
        ack({ success: false, message: 'Task not found' });
        return;
      }

      const workspaceId = (task.workspaceId as unknown as { toString(): string }).toString();

      // Remove comments first, then the task
      await Promise.all([
        CommentModel.deleteMany({ taskId: payload.taskId }),
        TaskModel.findByIdAndDelete(payload.taskId),
      ]);

      io.to(workspaceId).emit('task:deleted', { taskId: payload.taskId });

      ack({ success: true, data: undefined });
    } catch (err) {
      ack({ success: false, message: (err as Error).message });
    }
  });
}
