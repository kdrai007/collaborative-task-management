// =============================================================================
// controllers/column.controller.ts — Column CRUD
// =============================================================================

import { z } from 'zod';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ColumnModel } from '../models/Column.js';
import { TaskModel }   from '../models/Task.js';
import { CommentModel } from '../models/Comment.js';
import { INITIAL_RANK, midRank } from '../lib/lexorank.js';

const createSchema = z.object({
  title: z.string().min(1).max(80),
});

const updateSchema = z.object({
  title: z.string().min(1).max(80),
});

/** POST /api/workspaces/:workspaceId/columns */
export async function createColumn(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const { workspaceId } = req.params as { workspaceId: string };
  const body = createSchema.parse(req.body);

  // Find the highest existing order string and append after it
  const last = await ColumnModel
    .findOne({ workspaceId })
    .sort({ order: -1 })  // highest lex rank = last column
    .lean();

  const order = last ? midRank(last.order, null) : INITIAL_RANK;

  const column = await ColumnModel.create({ workspaceId, title: body.title, order });
  await rep.status(201).send({ success: true, data: { column: column.toJSON() } });
}

/** PATCH /api/workspaces/:workspaceId/columns/:columnId */
export async function updateColumn(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const { columnId } = req.params as { columnId: string };
  const body = updateSchema.parse(req.body);

  const column = await ColumnModel.findByIdAndUpdate(
    columnId,
    { $set: { title: body.title } },
    { returnDocument: 'after', runValidators: true },
  );

  if (!column) {
    await rep.status(404).send({ success: false, message: 'Column not found' });
    return;
  }

  await rep.send({ success: true, data: { column: column.toJSON() } });
}

/** DELETE /api/workspaces/:workspaceId/columns/:columnId */
export async function deleteColumn(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const { columnId } = req.params as { columnId: string };

  // Cascade: delete all tasks and their comments
  const taskIds = await TaskModel.find({ columnId }).distinct('_id');
  await Promise.all([
    CommentModel.deleteMany({ taskId: { $in: taskIds } }),
    TaskModel.deleteMany({ columnId }),
    ColumnModel.findByIdAndDelete(columnId),
  ]);

  await rep.send({ success: true, data: null });
}
