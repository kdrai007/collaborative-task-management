// =============================================================================
// models/User.ts — Mongoose User model
// =============================================================================

import mongoose, { Schema, type Document } from 'mongoose';

/** Shape of a User as stored in MongoDB (password is hashed). */
export interface IUserDocument extends Document {
  name:      string;
  email:     string;
  password:  string; // bcrypt hash — NEVER returned in API responses
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
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
        delete r['password']; // never leak the hash
        return r;
      },
    },
  },
);

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);
