import { z } from 'zod';

export const createClusterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  color: z.string().optional(),
  tags: z.string().optional(),
});

export type CreateClusterFormData = z.infer<typeof createClusterSchema>;
