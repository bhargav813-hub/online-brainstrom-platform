import { z } from 'zod';

export const createIdeaSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().max(2000).optional(),
  tags: z.string().optional(),
});

export const updateIdeaSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200).optional(),
  content: z.string().max(2000).optional(),
  tags: z.string().optional(),
  changeNote: z.string().max(200).optional(),
});

export type CreateIdeaFormData = z.infer<typeof createIdeaSchema>;
export type UpdateIdeaFormData = z.infer<typeof updateIdeaSchema>;
