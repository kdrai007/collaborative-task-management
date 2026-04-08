// =============================================================================
// routes/task.routes.ts
// =============================================================================

import type { FastifyInstance } from 'fastify';
import { createTask, getTask, updateTask, deleteTask } from '../controllers/task.controller.js';
import { requireRole } from '../lib/rbac.js';

export async function taskRoutes(fastify: FastifyInstance): Promise<void> {
  const auth  = fastify.authenticate;
  const guard = (role: Parameters<typeof requireRole>[0]) => [auth, requireRole(role)];

  fastify.post('/',         { preHandler: guard('member') }, createTask);
  fastify.get('/:taskId',   { preHandler: guard('viewer') }, getTask);
  fastify.patch('/:taskId', { preHandler: guard('member') }, updateTask);
  fastify.delete('/:taskId',{ preHandler: guard('member') }, deleteTask);
}
