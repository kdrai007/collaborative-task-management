// =============================================================================
// models/Column.ts — Mongoose Column model
// =============================================================================

import mongoose, { Schema, type Document } from 'mongoose';

export interface IColumnDocument extends Document {
  workspaceId: mongoose.Types.ObjectId;
  title:       string;
  /** LexoRank ordering string — NEVER an integer. */
  order:       string;
  createdAt:   Date;
}

const columnSchema = new Schema<IColumnDocument>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    title:       { type: String, required: true, trim: true },
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
        delete r['_id'];
        delete r['__v'];
        return r;
      },
    },
  },
);

export const ColumnModel = mongoose.model<IColumnDocument>('Column', columnSchema);
