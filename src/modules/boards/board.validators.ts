import { z } from 'zod';

export const createBoardSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  workspaceId: z.string().min(1, 'Workspace ID is required'),
});

export const updateBoardSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
});
