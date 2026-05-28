import { z } from 'zod';

export const createClusterSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  sessionId: z.string().min(1),
  tags: z.array(z.string()).optional(),
  color: z.string().optional(),
  ideaIds: z.array(z.string()).optional(),
});

export const updateClusterSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
  color: z.string().optional(),
});

export const assignIdeasSchema = z.object({
  ideaIds: z.array(z.string().min(1)).min(1),
});
