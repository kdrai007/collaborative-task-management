// =============================================================================
// routes/index.ts — Aggregates all route modules under /api
//
// This is the only place route prefixes are set. Keep prefixes here, not
// inside individual route files, so it is easy to version the API later.
// =============================================================================

import type { FastifyInstance } from 'fastify';
import { authRoutes }      from './auth.routes.js';
import { workspaceRoutes } from './workspace.routes.js';
import { columnRoutes }    from './column.routes.js';
import { taskRoutes }      from './task.routes.js';
import { commentRoutes }   from './comment.routes.js';

export async function registerRoutes(fastify: FastifyInstance): Promise<void> {
  // Health check — unauthenticated, used by load balancers / uptime monitors
  fastify.get('/health', async (_req, rep) => {
    await rep.send({ success: true, data: { status: 'ok' } });
  });

  fastify.register(authRoutes,      { prefix: '/auth' });
  fastify.register(workspaceRoutes, { prefix: '/workspaces' });

  // Column and task routes are scoped under their workspace
  fastify.register(columnRoutes,  { prefix: '/workspaces/:workspaceId/columns' });
  fastify.register(taskRoutes,    { prefix: '/workspaces/:workspaceId/tasks' });
  fastify.register(commentRoutes, { prefix: '/workspaces/:workspaceId/tasks/:taskId/comments' });
}
