import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
});

export const inviteUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['participant', 'facilitator', 'reviewer', 'workspace_admin']).optional(),
});

export const assignRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(['participant', 'facilitator', 'reviewer', 'workspace_admin']),
});
