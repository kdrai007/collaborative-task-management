// =============================================================================
// models/Comment.ts — Mongoose Comment model
// =============================================================================

import mongoose, { Schema, type Document } from 'mongoose';

export interface ICommentDocument extends Document {
  taskId:    mongoose.Types.ObjectId;
  authorId:  mongoose.Types.ObjectId;
  body:      string;
  createdAt: Date;
}

const commentSchema = new Schema<ICommentDocument>(
  {
    taskId:   { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    body:     { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        const r = ret as Record<string, unknown>;
        r['id']       = (r['_id'] as mongoose.Types.ObjectId).toString();
        r['taskId']   = (r['taskId'] as mongoose.Types.ObjectId).toString();
        r['authorId'] = (r['authorId'] as mongoose.Types.ObjectId).toString();
        delete r['_id'];
        delete r['__v'];
        return r;
      },
    },
  },
);

export const CommentModel = mongoose.model<ICommentDocument>('Comment', commentSchema);
