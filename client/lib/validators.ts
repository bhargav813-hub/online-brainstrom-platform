import { z } from 'zod';

// ─── Auth ───────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

// ─── User ───────────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatar: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

// ─── Workspace ──────────────────────────────────────────────────────

export const createWorkspaceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const inviteUserSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  role: z.enum(['participant', 'reviewer', 'facilitator', 'workspace_admin']).optional(),
});

export const assignRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(['participant', 'reviewer', 'facilitator', 'workspace_admin']),
});

// ─── Board ──────────────────────────────────────────────────────────

export const createBoardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(500).optional(),
  workspaceId: z.string().min(1),
});

export const updateBoardSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
});

// ─── Session ────────────────────────────────────────────────────────

export const createSessionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(500).optional(),
  boardId: z.string().min(1),
  workspaceId: z.string().min(1),
  maxParticipants: z.number().min(2).max(100).optional(),
  settings: z.object({
    allowAnonymous: z.boolean().optional(),
    votingEnabled: z.boolean().optional(),
    maxIdeasPerUser: z.number().min(1).max(100).optional(),
  }).optional(),
});

export const updateSessionSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(['active', 'paused', 'ended']).optional(),
});

// ─── Idea ───────────────────────────────────────────────────────────

export const createIdeaSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  content: z.string().max(10000).optional(),
  sessionId: z.string().min(1),
  parentIdeaId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateIdeaSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  content: z.string().max(10000).optional(),
  tags: z.array(z.string()).optional(),
  changeNote: z.string().max(200).optional(),
});

// ─── Vote ───────────────────────────────────────────────────────────

export const castVoteSchema = z.object({
  ideaId: z.string().min(1),
  sessionId: z.string().min(1),
  type: z.enum(['upvote', 'downvote']),
  weight: z.number().min(1).max(5).optional(),
});

// ─── Cluster ────────────────────────────────────────────────────────

export const createClusterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  sessionId: z.string().min(1),
  tags: z.array(z.string()).optional(),
  color: z.string().optional(),
  ideaIds: z.array(z.string()).optional(),
});

export const updateClusterSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  tags: z.array(z.string()).optional(),
  color: z.string().optional(),
});

// ─── Type Exports ───────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type InviteUserInput = z.infer<typeof inviteUserSchema>;
export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type CreateIdeaInput = z.infer<typeof createIdeaSchema>;
export type UpdateIdeaInput = z.infer<typeof updateIdeaSchema>;
export type CastVoteInput = z.infer<typeof castVoteSchema>;
export type CreateClusterInput = z.infer<typeof createClusterSchema>;
export type UpdateClusterInput = z.infer<typeof updateClusterSchema>;
