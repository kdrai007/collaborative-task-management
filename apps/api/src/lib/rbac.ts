// =============================================================================
// lib/rbac.ts — RBAC preHandler factory
//
// Returns a Fastify preHandler that checks the requesting user's role in a
// workspace. Must run AFTER fastify.authenticate (which populates req.user).
//
// Role hierarchy (lowest → highest):  viewer < member < admin
// =============================================================================

import type { FastifyRequest, FastifyReply } from 'fastify';
import { WorkspaceModel } from '../models/Workspace.js';
import type { WorkspaceRole } from '@repo/types';

/** Numeric rank for each role — used to compare minimum required role. */
const ROLE_LEVEL: Record<WorkspaceRole, number> = {
  viewer: 0,
  member: 1,
  admin:  2,
};

/**
 * Factory that returns a preHandler checking the user has at least `minRole`
 * in the workspace identified by `:workspaceId` in the route params.
 *
 * @example
 *   { preHandler: [fastify.authenticate, requireRole('admin')] }
 */
export function requireRole(minRole: WorkspaceRole) {
  return async (req: FastifyRequest, rep: FastifyReply): Promise<void> => {
    const { workspaceId } = req.params as { workspaceId: string };

    const workspace = await WorkspaceModel
      .findById(workspaceId)
      .lean();

    if (!workspace) {
      await rep.status(404).send({ success: false, message: 'Workspace not found' });
      return;
    }

    const member = workspace.members.find(
      (m) => m.userId.toString() === req.user.userId,
    );

    if (!member) {
      await rep.status(403).send({ success: false, message: 'Not a workspace member' });
      return;
    }

    if (ROLE_LEVEL[member.role] < ROLE_LEVEL[minRole]) {
      await rep.status(403).send({ success: false, message: 'Insufficient permissions' });
      return;
    }
  };
}
