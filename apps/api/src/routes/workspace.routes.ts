// =============================================================================
// routes/workspace.routes.ts
// =============================================================================

import type { FastifyInstance } from 'fastify';
import {
  createWorkspace, listWorkspaces, getWorkspace,
  updateWorkspace, deleteWorkspace,
  addMember, removeMember,
} from '../controllers/workspace.controller.js';
import { requireRole } from '../lib/rbac.js';

export async function workspaceRoutes(fastify: FastifyInstance): Promise<void> {
  const auth  = fastify.authenticate;
  const guard = (role: Parameters<typeof requireRole>[0]) => [auth, requireRole(role)];

  // --- Workspace CRUD ---
  fastify.post('/',                         { preHandler: [auth] },           createWorkspace);
  fastify.get('/',                          { preHandler: [auth] },           listWorkspaces);
  fastify.get('/:workspaceId',              { preHandler: guard('viewer') },  getWorkspace);
  fastify.patch('/:workspaceId',            { preHandler: guard('admin') },   updateWorkspace);
  fastify.delete('/:workspaceId',           { preHandler: guard('admin') },   deleteWorkspace);

  // --- Member management (admin only) ---
  fastify.post('/:workspaceId/members',              { preHandler: guard('admin') }, addMember);
  fastify.delete('/:workspaceId/members/:userId',    { preHandler: guard('admin') }, removeMember);
}
