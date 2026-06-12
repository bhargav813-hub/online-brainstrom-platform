'use client';

import { Button } from '@/components/ui/button';
import { useCastVote, useRemoveVote, useUserVotes } from '@/features/votes/hooks/useVote';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoteButtonsProps {
  ideaId: string;
  sessionId: string;
  upvoteCount: number;
  downvoteCount: number;
}

export function VoteButtons({ ideaId, sessionId, upvoteCount, downvoteCount }: VoteButtonsProps) {
  const castVote = useCastVote(sessionId);
  const removeVote = useRemoveVote(sessionId);
  const { data: userVotes } = useUserVotes(sessionId);

  const myVote = userVotes?.find((v) => v.idea === ideaId);
  const isUpvoted = myVote?.type === 'upvote';
  const isDownvoted = myVote?.type === 'downvote';

  const isLoading = castVote.isPending || removeVote.isPending;

  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-6 w-6 rounded-md transition-colors',
          isUpvoted
            ? 'text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 hover:text-emerald-500'
            : 'text-muted-foreground hover:text-emerald-500'
        )}
        onClick={(e) => {
          e.stopPropagation();
          if (isUpvoted) {
            removeVote.mutate(ideaId);
          } else {
            castVote.mutate({ ideaId, sessionId, type: 'upvote' });
          }
        }}
        disabled={isLoading}
      >
        <ThumbsUp className="h-3 w-3" />
      </Button>
      <span className={cn(
        'text-[10px] font-semibold min-w-[1.2rem] text-center tabular-nums',
        (upvoteCount - downvoteCount) > 0 && 'text-emerald-500',
        (upvoteCount - downvoteCount) < 0 && 'text-red-400'
      )}>
        {upvoteCount - downvoteCount}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-6 w-6 rounded-md transition-colors',
          isDownvoted
            ? 'text-red-400 bg-red-400/10 hover:bg-red-400/20 hover:text-red-400'
            : 'text-muted-foreground hover:text-red-400'
        )}
        onClick={(e) => {
          e.stopPropagation();
          if (isDownvoted) {
            removeVote.mutate(ideaId);
          } else {
            castVote.mutate({ ideaId, sessionId, type: 'downvote' });
          }
        }}
        disabled={isLoading}
      >
        <ThumbsDown className="h-3 w-3" />
      </Button>
    </div>
  );
}
