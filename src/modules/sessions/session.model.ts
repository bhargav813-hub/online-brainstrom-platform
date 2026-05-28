import mongoose, { Schema, Document } from 'mongoose';
import { SessionStatus } from '../../types';

/**
 * Session Model
 * A brainstorming session within a board.
 * Tracks status (active/paused/ended), facilitator, and configuration.
 */
export interface ISession extends Document {
  title: string;
  description: string;
  board: mongoose.Types.ObjectId;
  workspace: mongoose.Types.ObjectId;
  facilitator: mongoose.Types.ObjectId;
  status: SessionStatus;
  maxParticipants?: number;
  startedAt?: Date;
  endedAt?: Date;
  settings: {
    allowAnonymousIdeas: boolean;
    votingEnabled: boolean;
    maxIdeasPerUser?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    title: {
      type: String,
      required: [true, 'Session title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      default: '',
      maxlength: 2000,
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    facilitator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SessionStatus),
      default: SessionStatus.ACTIVE,
    },
    maxParticipants: {
      type: Number,
      min: 2,
      max: 100,
    },
    startedAt: { type: Date },
    endedAt: { type: Date },
    settings: {
      allowAnonymousIdeas: { type: Boolean, default: false },
      votingEnabled: { type: Boolean, default: true },
      maxIdeasPerUser: { type: Number },
    },
  },
  { timestamps: true }
);

// ==================== INDEXES ====================
sessionSchema.index({ board: 1, status: 1 });
sessionSchema.index({ workspace: 1 });
sessionSchema.index({ facilitator: 1 });

export const Session = mongoose.model<ISession>('Session', sessionSchema);
