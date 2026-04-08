// =============================================================================
// routes/comment.routes.ts
// =============================================================================

import type { FastifyInstance } from 'fastify';
import { listComments, addComment, deleteComment } from '../controllers/comment.controller.js';
import { requireRole } from '../lib/rbac.js';

export async function commentRoutes(fastify: FastifyInstance): Promise<void> {
  const auth  = fastify.authenticate;
  const guard = (role: Parameters<typeof requireRole>[0]) => [auth, requireRole(role)];

  fastify.get('/',              { preHandler: guard('viewer') }, listComments);
  fastify.post('/',             { preHandler: guard('member') }, addComment);
  fastify.delete('/:commentId', { preHandler: guard('member') }, deleteComment);
}
