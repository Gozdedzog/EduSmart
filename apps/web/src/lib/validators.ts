import { z } from 'zod';

export const eventInput = z.object({
  userId: z.string().min(1),
  type: z.enum(['page_view', 'content_start', 'content_complete', 'reaction']),
  contentId: z.string().optional(),
  dwellMs: z.number().optional(),
  outcome: z.enum(['started', 'completed', 'abandoned']).optional(),
  tagsSnapshot: z.array(z.string()).optional(),
  difficultySnapshot: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  payload: z.any().optional(),
});

export type EventInput = z.infer<typeof eventInput>;
