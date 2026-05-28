import { z } from 'zod';

export const createSessionSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  boardId: z.string().min(1, 'Board ID is required'),
  workspaceId: z.string().min(1, 'Workspace ID is required'),
  maxParticipants: z.number().min(2).max(100).optional(),
  settings: z.object({
    allowAnonymousIdeas: z.boolean().optional(),
    votingEnabled: z.boolean().optional(),
    maxIdeasPerUser: z.number().min(1).optional(),
  }).optional(),
});

export const updateSessionSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['active', 'paused', 'ended']).optional(),
});
