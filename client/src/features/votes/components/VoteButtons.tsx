'use client';

import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCastVote, useRemoveVote } from '@/features/votes/hooks/useVote';
import { cn } from '@/lib/utils';

interface VoteButtonsProps {
  ideaId: string;
  sessionId: string;
  upvotes: number;
  downvotes: number;
}

export function VoteButtons({ ideaId, sessionId, upvotes, downvotes }: VoteButtonsProps) {
  const castVote = useCastVote(sessionId);
  const removeVote = useRemoveVote(sessionId);

  return (
    <div className="flex items-center gap-0.5">
      <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" onClick={() => castVote.mutate({ ideaId, sessionId, type: 'upvote' })}>
        <ThumbsUp className="h-3.5 w-3.5" />
      </Button>
      <span className={cn('min-w-[2rem] text-center text-xs font-bold', upvotes - downvotes > 0 ? 'text-emerald-600' : upvotes - downvotes < 0 ? 'text-rose-600' : 'text-muted-foreground')}>
        {upvotes - downvotes}
      </span>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20" onClick={() => castVote.mutate({ ideaId, sessionId, type: 'downvote' })}>
        <ThumbsDown className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
