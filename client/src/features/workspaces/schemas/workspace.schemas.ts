import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  role: z.enum(['participant', 'facilitator', 'reviewer', 'workspace_admin']).optional(),
});

export type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>;
export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;
