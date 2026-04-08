// =============================================================================
// routes/column.routes.ts
// =============================================================================

import type { FastifyInstance } from 'fastify';
import { createColumn, updateColumn, deleteColumn } from '../controllers/column.controller.js';
import { requireRole } from '../lib/rbac.js';

export async function columnRoutes(fastify: FastifyInstance): Promise<void> {
  const auth  = fastify.authenticate;
  const guard = (role: Parameters<typeof requireRole>[0]) => [auth, requireRole(role)];

  fastify.post('/',            { preHandler: guard('member') }, createColumn);
  fastify.patch('/:columnId',  { preHandler: guard('member') }, updateColumn);
  fastify.delete('/:columnId', { preHandler: guard('admin') },  deleteColumn);
}
