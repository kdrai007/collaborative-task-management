// =============================================================================
// controllers/task.controller.ts — Task REST CRUD
//
// Real-time task operations (move, live update) are handled via Socket.io
// in src/socket/task.handlers.ts. These REST endpoints are for initial loads
// and non-real-time workflows.
// =============================================================================

import { z } from 'zod';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { TaskModel }    from '../models/Task.js';
import { CommentModel } from '../models/Comment.js';
import { INITIAL_RANK } from '../lib/lexorank.js';

const createSchema = z.object({
  workspaceId: z.string(),
  columnId:    z.string(),
  title:       z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  priority:    z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assigneeId:  z.string().nullable().optional(),
  dueDate:     z.string().datetime().nullable().optional(),
});

const updateSchema = z.object({
  title:       z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  priority:    z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  status:      z.enum(['open', 'in_progress', 'in_review', 'done']).optional(),
  assigneeId:  z.string().nullable().optional(),
  dueDate:     z.string().datetime().nullable().optional(),
  columnId:    z.string().optional(), // allow moving column via REST too
});

/** POST /api/workspaces/:workspaceId/tasks */
export async function createTask(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const { workspaceId } = req.params as { workspaceId: string };
  const body = createSchema.parse(req.body);

  // Place new task at the end of the column
  const last = await TaskModel
    .findOne({ columnId: body.columnId })
    .sort({ order: -1 })
    .lean();

  const order = last ? last.order + INITIAL_RANK : INITIAL_RANK;

  const task = await TaskModel.create({
    workspaceId,
    columnId:    body.columnId,
    title:       body.title,
    description: body.description ?? '',
    priority:    body.priority ?? 'medium',
    assigneeId:  body.assigneeId ?? null,
    dueDate:     body.dueDate ?? null,
    order,
  });

  await rep.status(201).send({ success: true, data: { task: task.toJSON() } });
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

  const task = await TaskModel.findByIdAndUpdate(
    taskId,
    { $set: body },
    { returnDocument: 'after', runValidators: true },
  );

  if (!task) {
    await rep.status(404).send({ success: false, message: 'Task not found' });
    return;
  }

  await rep.send({ success: true, data: { task: task.toJSON() } });
}

/** DELETE /api/workspaces/:workspaceId/tasks/:taskId */
export async function deleteTask(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const { taskId } = req.params as { taskId: string };

  // Cascade: remove comments belonging to this task
  await Promise.all([
    CommentModel.deleteMany({ taskId }),
    TaskModel.findByIdAndDelete(taskId),
  ]);

  await rep.send({ success: true, data: null });
}
