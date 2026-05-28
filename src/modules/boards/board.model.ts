import mongoose, { Schema, Document } from 'mongoose';

/**
 * Board Model
 * A board belongs to a workspace and contains brainstorming sessions.
 * Boards can be archived to preserve history without cluttering active views.
 */
export interface IBoard extends Document {
  title: string;
  description: string;
  workspace: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  isArchived: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const boardSchema = new Schema<IBoard>(
  {
    title: {
      type: String,
      required: [true, 'Board title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      default: '',
      maxlength: 2000,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    archivedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// ==================== INDEXES ====================
boardSchema.index({ workspace: 1, isArchived: 1 });
boardSchema.index({ createdBy: 1 });

export const Board = mongoose.model<IBoard>('Board', boardSchema);
