import mongoose, { Schema, Document } from 'mongoose';

/**
 * IdeaVersion Model
 * Tracks every edit to an idea for concept evolution tracking.
 * Allows restoring previous versions and viewing change timelines.
 */
export interface IIdeaVersion extends Document {
  idea: mongoose.Types.ObjectId;
  version: number;
  title: string;
  content: string;
  editedBy: mongoose.Types.ObjectId;
  changeNote: string;
  createdAt: Date;
}

const ideaVersionSchema = new Schema<IIdeaVersion>(
  {
    idea: {
      type: Schema.Types.ObjectId,
      ref: 'Idea',
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    editedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    changeNote: {
      type: String,
      default: '',
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// ==================== INDEXES ====================
ideaVersionSchema.index({ idea: 1, version: -1 });

export const IdeaVersion = mongoose.model<IIdeaVersion>('IdeaVersion', ideaVersionSchema);
