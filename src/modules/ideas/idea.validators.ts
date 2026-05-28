import { z } from 'zod';

export const createIdeaSchema = z.object({
  title: z.string().min(1).max(300),
  content: z.string().max(10000).optional(),
  sessionId: z.string().min(1, 'Session ID is required'),
  parentIdeaId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateIdeaSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  content: z.string().max(10000).optional(),
  tags: z.array(z.string()).optional(),
  changeNote: z.string().max(500).optional(),
});

export const moveIdeaSchema = z.object({
  newParentId: z.string().nullable(),
});
