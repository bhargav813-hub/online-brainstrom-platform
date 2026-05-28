import mongoose, { Schema, Document } from 'mongoose';

/**
 * Cluster Model
 * Groups related ideas together within a session.
 * Supports tags/labels for categorization.
 */
export interface ICluster extends Document {
  name: string;
  description: string;
  session: mongoose.Types.ObjectId;
  ideas: mongoose.Types.ObjectId[];
  tags: string[];
  color: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const clusterSchema = new Schema<ICluster>(
  {
    name: {
      type: String,
      required: [true, 'Cluster name is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      default: '',
      maxlength: 1000,
    },
    session: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    ideas: [{
      type: Schema.Types.ObjectId,
      ref: 'Idea',
    }],
    tags: [{ type: String, trim: true }],
    color: {
      type: String,
      default: '#6366f1', // Default indigo
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// ==================== INDEXES ====================
clusterSchema.index({ session: 1 });

export const Cluster = mongoose.model<ICluster>('Cluster', clusterSchema);
