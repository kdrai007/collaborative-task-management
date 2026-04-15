// =============================================================================
// controllers/workspace.controller.ts — CRUD + member management
//
// RBAC is enforced via preHandlers in the route layer, not here.
// Controllers trust that req.user is valid (authenticate ran first).
// =============================================================================

import { z } from 'zod';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { WorkspaceModel } from '../models/Workspace.js';
import { ColumnModel } from '../models/Column.js';
import { TaskModel } from '../models/Task.js';
import { CommentModel } from '../models/Comment.js';
import { UserModel } from '../models/User.js';
import { INITIAL_RANK } from '../lib/lexorank.js';
import type { WorkspaceRole } from '@repo/types';

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

const createSchema = z.object({
  name: z.string().min(1).max(80),
  description: z.string().max(500).optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  description: z.string().max(500).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided' }
);

const addMemberSchema = z.object({
  email: z.email(),
  role: z.enum(['admin', 'member', 'viewer']),
});

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

/** POST /api/workspaces */
export async function createWorkspace(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const body = createSchema.parse(req.body);

  const workspace = await WorkspaceModel.create({
    name: body.name,
    description: body.description ?? '',
    ownerId: req.user.userId,
    // Creator is automatically an admin member
    members: [{ userId: req.user.userId, role: 'admin', joinedAt: new Date() }],
  });

  // Seed three default columns with LexoRank spacing
  await ColumnModel.insertMany([
    { workspaceId: workspace.id, title: 'To Do', order: 'f' },
    { workspaceId: workspace.id, title: 'In Progress', order: 'n' },
    { workspaceId: workspace.id, title: 'Done', order: 'u' },
  ]);

  await rep.status(201).send({ success: true, data: { workspace: workspace.toJSON() } });
}

/** GET /api/workspaces */
export async function listWorkspaces(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  // Return workspaces where the user is a member (any role)
  const workspaces = await WorkspaceModel
    .find({ 'members.userId': req.user.userId })
    .lean();

  const serialised = workspaces.map((w) => ({ ...w, id: w._id.toString() }));
  await rep.send({ success: true, data: { workspaces: serialised } });
}

/** GET /api/workspaces/:workspaceId */
export async function getWorkspace(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const { workspaceId } = req.params as { workspaceId: string };

  const workspace = await WorkspaceModel.findById(workspaceId).lean();
  if (!workspace) {
    await rep.status(404).send({ success: false, message: 'Workspace not found' });
    return;
  }

  // Fetch columns sorted by LexoRank order
  const columns = await ColumnModel
    .find({ workspaceId })
    .sort({ order: 1 })
    .lean();

  // Fetch all tasks for the workspace, sorted by order within each column
  const tasks = await TaskModel
    .find({ workspaceId })
    .sort({ order: 1 })
    .lean();

  await rep.send({
    success: true,
    data: {
      workspace: { ...workspace, id: workspace._id.toString() },
      columns: columns.map((c) => ({ ...c, id: c._id.toString() })),
      tasks: tasks.map((t) => ({ ...t, id: t._id.toString() })),
    },
  });
}

/** PATCH /api/workspaces/:workspaceId */
export async function updateWorkspace(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const { workspaceId } = req.params as { workspaceId: string };
  const body = updateSchema.parse(req.body);

  const workspace = await WorkspaceModel.findByIdAndUpdate(
    workspaceId,
    { $set: body },
    { returnDocument: 'after', runValidators: true },
  );

  if (!workspace) {
    await rep.status(404).send({ success: false, message: 'Workspace not found' });
    return;
  }

  await rep.send({ success: true, data: { workspace: workspace.toJSON() } });
}

/** DELETE /api/workspaces/:workspaceId */
export async function deleteWorkspace(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const { workspaceId } = req.params as { workspaceId: string };

  // Cascade-delete all associated data
  const taskIds = await TaskModel.find({ workspaceId }).distinct('_id');

  await Promise.all([
    CommentModel.deleteMany({ taskId: { $in: taskIds } }),
    TaskModel.deleteMany({ workspaceId }),
    ColumnModel.deleteMany({ workspaceId }),
    WorkspaceModel.findByIdAndDelete(workspaceId),
  ]);

  await rep.send({ success: true, data: null });
}

/** POST /api/workspaces/:workspaceId/members */
export async function addMember(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const { workspaceId } = req.params as { workspaceId: string };
  const body = addMemberSchema.parse(req.body);

  // Find the user to invite by email
  const invitee = await UserModel.findOne({ email: body.email }).lean();
  if (!invitee) {
    await rep.status(404).send({ success: false, message: 'No user with that email' });
    return;
  }

  // Prevent duplicate membership
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    await rep.status(404).send({ success: false, message: 'Workspace not found' });
    return;
  }

  const alreadyMember = workspace.members.some(
    (m) => m.userId.toString() === invitee._id.toString(),
  );
  if (alreadyMember) {
    await rep.status(409).send({ success: false, message: 'User is already a member' });
    return;
  }

  workspace.members.push({
    userId: invitee._id,
    role: body.role as WorkspaceRole,
    joinedAt: new Date(),
  });
  await workspace.save();

  await rep.status(201).send({ success: true, data: { workspace: workspace.toJSON() } });
}

/** DELETE /api/workspaces/:workspaceId/members/:userId */
export async function removeMember(req: FastifyRequest, rep: FastifyReply): Promise<void> {
  const { workspaceId, userId } = req.params as { workspaceId: string; userId: string };

  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    await rep.status(404).send({ success: false, message: 'Workspace not found' });
    return;
  }

  // Prevent removing the owner
  if (workspace.ownerId.toString() === userId) {
    await rep.status(400).send({ success: false, message: 'Cannot remove the workspace owner' });
    return;
  }

  const before = workspace.members.length;
  workspace.members = workspace.members.filter((m) => m.userId.toString() !== userId);

  if (workspace.members.length === before) {
    await rep.status(404).send({ success: false, message: 'Member not found' });
    return;
  }

  await workspace.save();
  await rep.send({ success: true, data: { workspace: workspace.toJSON() } });
}
