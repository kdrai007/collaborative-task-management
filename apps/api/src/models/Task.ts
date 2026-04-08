// =============================================================================
// models/Task.ts — Mongoose Task model
// =============================================================================

import mongoose, { Schema, type Document } from 'mongoose';
import type { TaskPriority, TaskStatus } from '@repo/types';

export interface ITaskDocument extends Document {
  workspaceId: mongoose.Types.ObjectId;
  columnId:    mongoose.Types.ObjectId;
  title:       string;
  description: string;
  priority:    TaskPriority;
  status:      TaskStatus;
  assigneeId:  mongoose.Types.ObjectId | null;
  dueDate:     Date | null;
  /** LexoRank ordering string within its column. */
  order:       string;
  createdAt:   Date;
  updatedAt:   Date;
}

const taskSchema = new Schema<ITaskDocument>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    columnId:    { type: Schema.Types.ObjectId, ref: 'Column',    required: true, index: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    priority:    { type: String, enum: ['low', 'medium', 'high', 'urgent'] as TaskPriority[], default: 'medium' },
    status:      { type: String, enum: ['open', 'in_progress', 'in_review', 'done'] as TaskStatus[], default: 'open' },
    assigneeId:  { type: Schema.Types.ObjectId, ref: 'User', default: null },
    dueDate:     { type: Date, default: null },
    order:       { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        const r = ret as Record<string, unknown>;
        r['id']          = (r['_id'] as mongoose.Types.ObjectId).toString();
        r['workspaceId'] = (r['workspaceId'] as mongoose.Types.ObjectId).toString();
        r['columnId']    = (r['columnId'] as mongoose.Types.ObjectId).toString();
        r['assigneeId']  = r['assigneeId']
          ? (r['assigneeId'] as mongoose.Types.ObjectId).toString()
          : null;
        r['dueDate'] = r['dueDate']
          ? (r['dueDate'] as Date).toISOString()
          : null;
        delete r['_id'];
        delete r['__v'];
        return r;
      },
    },
  },
);

export const TaskModel = mongoose.model<ITaskDocument>('Task', taskSchema);
