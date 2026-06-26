'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { VoteButtons } from '@/features/votes/components/VoteButtons';
import { formatRelativeTime } from '@/lib/formatters';
import { Clock, MessageSquare } from 'lucide-react';
import type { Idea } from '@/types/idea.types';

interface IdeaCardProps {
  idea: Idea;
  sessionId: string;
  onClick?: () => void;
}

export function IdeaCard({ idea, sessionId, onClick }: IdeaCardProps) {
  const author = typeof idea.author === 'object' ? idea.author : null;

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:border-violet-200 dark:hover:border-violet-800"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-sm">{idea.title}</h4>
            {idea.content && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{idea.content}</p>
            )}
          </div>
          <VoteButtons ideaId={idea._id} sessionId={sessionId} upvotes={idea.upvoteCount || 0} downvotes={idea.downvoteCount || 0} />
        </div>

        {idea.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {idea.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {author && (
            <div className="flex items-center gap-1.5">
              <UserAvatar name={author.name} avatar={author.avatar} size="sm" />
              <span>{author.name}</span>
            </div>
          )}
          <div className="flex items-center gap-1 ml-auto">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(idea.createdAt)}
          </div>
          {idea.children && idea.children.length > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {idea.children.length}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
