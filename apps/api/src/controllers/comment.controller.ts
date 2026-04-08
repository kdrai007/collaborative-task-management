// =============================================================================
// controllers/comment.controller.ts — Comment CRUD
// =============================================================================

import { z } from 'zod';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { CommentModel } from '../models/Comment.js';

const createSchema = z.object({
  body: z.string().min(1).max(2000),
});

/** GET /api/workspaces/:workspaceId/tasks/:taskId/comments */
export async function listComments(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const { taskId } = req.params as { taskId: string };

  const comments = await CommentModel
    .find({ taskId })
    .sort({ createdAt: 1 }) // oldest first for conversation order
    .lean();

  await rep.send({
    success: true,
    data: { comments: comments.map((c) => ({ ...c, id: c._id.toString() })) },
  });
}

/** POST /api/workspaces/:workspaceId/tasks/:taskId/comments */
export async function addComment(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const { taskId } = req.params as { taskId: string };
  const body = createSchema.parse(req.body);

  const comment = await CommentModel.create({
    taskId,
    authorId: req.user.userId,
    body:     body.body,
  });

  await rep.status(201).send({ success: true, data: { comment: comment.toJSON() } });
}

/** DELETE /api/workspaces/:workspaceId/tasks/:taskId/comments/:commentId */
export async function deleteComment(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const { commentId } = req.params as { commentId: string };

  const comment = await CommentModel.findById(commentId);
  if (!comment) {
    await rep.status(404).send({ success: false, message: 'Comment not found' });
    return;
  }

  // Only the author can delete their own comment (workspace admins use the cascade delete on task)
  if (comment.authorId.toString() !== req.user.userId) {
    await rep.status(403).send({ success: false, message: 'Not the comment author' });
    return;
  }

  await comment.deleteOne();
  await rep.send({ success: true, data: null });
}
