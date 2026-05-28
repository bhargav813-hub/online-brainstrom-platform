import { z } from 'zod';

export const castVoteSchema = z.object({
  ideaId: z.string().min(1),
  sessionId: z.string().min(1),
  type: z.enum(['upvote', 'downvote']),
  weight: z.number().min(1).max(10).optional(),
});
