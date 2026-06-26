import { z } from 'zod';

export const castVoteSchema = z.object({
  type: z.enum(['upvote', 'downvote']),
  weight: z.number().min(1).max(10).optional(),
});

export type CastVoteFormData = z.infer<typeof castVoteSchema>;
