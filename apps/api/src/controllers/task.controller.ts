// =============================================================================
// controllers/task.controller.ts — Task REST CRUD
//
// Real-time task operations (move, live update) are handled via Socket.io
// in src/socket/task.handlers.ts. These REST endpoints are for initial loads
// and non-real-time workflows.
// =============================================================================

import { z } from 'zod';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { TaskModel } from '../models/Task.js';
import { TaskOperations } from '../domain/TaskOperations.js';

const createSchema = z.object({
  columnId: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assigneeId: z.string().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  status: z.enum(['open', 'in_progress', 'in_review', 'done']).optional(),
  assigneeId: z.string().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  columnId: z.string().optional(), // allow moving column via REST too
});

/** POST /api/workspaces/:workspaceId/tasks */
export async function createTask(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const { workspaceId } = req.params as { workspaceId: string };
  const body = createSchema.parse(req.body);

  const result = await TaskOperations.createTask({
    workspaceId,
    columnId: body.columnId,
    title: body.title,
    description: body.description,
    priority: body.priority,
    assigneeId: body.assigneeId,
    dueDate: body.dueDate,
  });

  await rep.status(201).send({ success: true, data: { task: result.data } });
}

/** GET /api/workspaces/:workspaceId/tasks/:taskId */
export async function getTask(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const { taskId } = req.params as { taskId: string };

  const task = await TaskModel.findById(taskId).lean();
  if (!task) {
    await rep.status(404).send({ success: false, message: 'Task not found' });
    return;
  }

  await rep.send({ success: true, data: { task: { ...task, id: task._id.toString() } } });
}

/** PATCH /api/workspaces/:workspaceId/tasks/:taskId */
export async function updateTask(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const { taskId } = req.params as { taskId: string };
  const body = updateSchema.parse(req.body);

  try {
    const result = await TaskOperations.updateTask({
      taskId,
      changes: body,
    });
    await rep.send({ success: true, data: { task: result.data } });
  } catch (err) {
    await rep.status(404).send({ success: false, message: (err as Error).message });
  }
}

/** DELETE /api/workspaces/:workspaceId/tasks/:taskId */
export async function deleteTask(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const { taskId } = req.params as { taskId: string };

  try {
    await TaskOperations.deleteTask({ taskId });
    await rep.send({ success: true, data: null });
  } catch (err) {
    await rep.status(404).send({ success: false, message: (err as Error).message });
  }
}

