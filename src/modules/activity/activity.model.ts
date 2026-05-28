import mongoose, { Schema, Document } from 'mongoose';
import { ActivityAction } from '../../types';

/**
 * ActivityLog Model
 * Records all significant events in a session for timeline/audit trail.
 * Uses a flexible metadata field for action-specific data.
 */
export interface IActivityLog extends Document {
  session: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  action: ActivityAction;
  targetType: string;
  targetId: mongoose.Types.ObjectId;
  metadata: Record<string, any>;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
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
    action: {
      type: String,
      enum: Object.values(ActivityAction),
      required: true,
    },
    targetType: {
      type: String,
      required: true,
      enum: ['Idea', 'Vote', 'Cluster', 'Session', 'Board'],
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// ==================== INDEXES ====================
activityLogSchema.index({ session: 1, createdAt: -1 });
activityLogSchema.index({ user: 1 });
activityLogSchema.index({ action: 1 });

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
