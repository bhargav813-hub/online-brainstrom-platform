import mongoose, { Schema, Document } from 'mongoose';

/**
 * Idea Model
 * Core entity — represents a single idea in the brainstorming tree.
 * Uses hybrid tree strategy: parent references + materialized path
 * for efficient subtree queries and simple node moves.
 *
 * Tree example:
 *   Root Idea (path: ",rootId,")
 *     ├── Child A  (path: ",rootId,childAId,", depth: 1)
 *     │   └── Grandchild (path: ",rootId,childAId,grandchildId,", depth: 2)
 *     └── Child B  (path: ",rootId,childBId,", depth: 1)
 */
export interface IIdea extends Document {
  title: string;
  content: string;
  session: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  parentIdea: mongoose.Types.ObjectId | null;
  path: string;        // Materialized path for fast subtree queries
  depth: number;       // 0 = root, 1 = first child, etc.
  position: number;    // Ordering among siblings
  tags: string[];
  isDeleted: boolean;
  upvoteCount: number;
  downvoteCount: number;
  currentVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const ideaSchema = new Schema<IIdea>(
  {
    title: {
      type: String,
      required: [true, 'Idea title is required'],
      trim: true,
      maxlength: 300,
    },
    content: {
      type: String,
      default: '',
      maxlength: 10000,
    },
    session: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentIdea: {
      type: Schema.Types.ObjectId,
      ref: 'Idea',
      default: null,
    },
    path: {
      type: String,
      default: '',
    },
    depth: {
      type: Number,
      default: 0,
      min: 0,
    },
    position: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String, trim: true }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    upvoteCount: { type: Number, default: 0 },
    downvoteCount: { type: Number, default: 0 },
    currentVersion: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// ==================== INDEXES ====================
ideaSchema.index({ session: 1, isDeleted: 1 });
ideaSchema.index({ parentIdea: 1 });
ideaSchema.index({ path: 1 });     // For subtree queries using regex
ideaSchema.index({ author: 1 });
ideaSchema.index({ tags: 1 });
ideaSchema.index({ session: 1, position: 1 });

export const Idea = mongoose.model<IIdea>('Idea', ideaSchema);
