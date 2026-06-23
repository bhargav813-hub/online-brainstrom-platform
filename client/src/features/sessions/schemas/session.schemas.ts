import { z } from 'zod';

export const createSessionSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
  maxParticipants: z.coerce.number().min(2).max(100).optional(),
});

export type CreateSessionFormData = z.infer<typeof createSessionSchema>;
