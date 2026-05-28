import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../../types';

/**
 * Workspace Model
 * Top-level organizational unit. Contains members with workspace-specific roles.
 * A workspace has many boards, which have many sessions.
 */
export interface IWorkspaceMember {
  user: mongoose.Types.ObjectId;
  role: UserRole;
  joinedAt: Date;
}

export interface IWorkspace extends Document {
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  members: IWorkspaceMember[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const workspaceMemberSchema = new Schema<IWorkspaceMember>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.PARTICIPANT,
    },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const workspaceSchema = new Schema<IWorkspace>(
  {
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      default: '',
      maxlength: 1000,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [workspaceMemberSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ==================== INDEXES ====================
workspaceSchema.index({ owner: 1 });
workspaceSchema.index({ 'members.user': 1 });

export const Workspace = mongoose.model<IWorkspace>('Workspace', workspaceSchema);
