// =============================================================================
// models/Workspace.ts — Mongoose Workspace model
// =============================================================================

import mongoose, { Schema, type Document } from 'mongoose';
import type { WorkspaceRole } from '@repo/types';

export interface IWorkspaceMemberDocument {
  userId:   mongoose.Types.ObjectId;
  role:     WorkspaceRole;
  joinedAt: Date;
}

export interface IWorkspaceDocument extends Document {
  name:        string;
  description: string;
  ownerId:     mongoose.Types.ObjectId;
  members:     IWorkspaceMemberDocument[];
  createdAt:   Date;
  updatedAt:   Date;
}

const workspaceMemberSchema = new Schema<IWorkspaceMemberDocument>(
  {
    userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role:     { type: String, enum: ['admin', 'member', 'viewer'], required: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const workspaceSchema = new Schema<IWorkspaceDocument>(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    ownerId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members:     [workspaceMemberSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        const r = ret as Record<string, unknown>;
        r['id'] = (r['_id'] as mongoose.Types.ObjectId).toString();
        delete r['_id'];
        delete r['__v'];
        if (Array.isArray(r['members'])) {
          r['members'] = (r['members'] as IWorkspaceMemberDocument[]).map((m) => ({
            userId:   m.userId.toString(),
            role:     m.role,
            joinedAt: m.joinedAt instanceof Date ? m.joinedAt.toISOString() : m.joinedAt,
          }));
        }
        return r;
      },
    },
  },
);

export const WorkspaceModel = mongoose.model<IWorkspaceDocument>('Workspace', workspaceSchema);
