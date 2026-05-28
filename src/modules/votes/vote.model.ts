import mongoose, { Schema, Document } from 'mongoose';
import { VoteType } from '../../types';

/**
 * Vote Model
 * Supports upvote/downvote with optional weighted voting.
 * Enforces one vote per user per idea via compound unique index.
 */
export interface IVote extends Document {
  idea: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  session: mongoose.Types.ObjectId;
  type: VoteType;
  weight: number;
  createdAt: Date;
  updatedAt: Date;
}

const voteSchema = new Schema<IVote>(
  {
    idea: {
      type: Schema.Types.ObjectId,
      ref: 'Idea',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    session: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(VoteType),
      required: true,
    },
    weight: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
  },
  { timestamps: true }
);

// ==================== INDEXES ====================
// One vote per user per idea
voteSchema.index({ idea: 1, user: 1 }, { unique: true });
voteSchema.index({ session: 1 });

export const Vote = mongoose.model<IVote>('Vote', voteSchema);
