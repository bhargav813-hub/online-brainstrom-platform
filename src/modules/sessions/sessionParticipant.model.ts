import mongoose, { Schema, Document } from 'mongoose';

/**
 * SessionParticipant Model
 * Tracks user presence in brainstorming sessions.
 * Records join/leave times and active status for analytics.
 */
export interface ISessionParticipant extends Document {
  session: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  joinedAt: Date;
  leftAt?: Date;
  isActive: boolean;
}

const sessionParticipantSchema = new Schema<ISessionParticipant>(
  {
    session: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    leftAt: { type: Date },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ==================== INDEXES ====================
// Compound index ensures a user has only one active record per session
sessionParticipantSchema.index({ session: 1, user: 1 });
sessionParticipantSchema.index({ session: 1, isActive: 1 });

export const SessionParticipant = mongoose.model<ISessionParticipant>(
  'SessionParticipant',
  sessionParticipantSchema
);
