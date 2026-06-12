'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { formatRelativeTime } from '@/lib/utils';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import type { Idea } from '@/types/models';
import { motion } from 'framer-motion';

interface IdeaCardProps {
  idea: Idea;
  onClick?: () => void;
  compact?: boolean;
}

export function IdeaCard({ idea, onClick, compact }: IdeaCardProps) {
  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer border border-border/30"
        onClick={onClick}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{idea.title}</p>
          <p className="text-xs text-muted-foreground">
            by {idea.author.name} · {formatRelativeTime(idea.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <ThumbsUp className="h-3 w-3" /> {idea.upvoteCount}
          </span>
          <span className="flex items-center gap-0.5">
            <ThumbsDown className="h-3 w-3" /> {idea.downvoteCount}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
    >
      <Card
        className="cursor-pointer hover:border-primary/30 transition-all duration-200 hover:shadow-md"
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-semibold line-clamp-2">{idea.title}</CardTitle>
            {idea.isDeleted && (
              <Badge variant="destructive" className="text-[10px] flex-shrink-0">
                Deleted
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {idea.content && (
            <p className="text-sm text-muted-foreground line-clamp-3">{idea.content}</p>
          )}

          {idea.tags && idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {idea.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <UserAvatar name={idea.author.name} avatar={idea.author.avatar} size="sm" />
              <div>
                <p className="text-xs font-medium">{idea.author.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {formatRelativeTime(idea.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3 text-emerald-500" />
                {idea.upvoteCount}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsDown className="h-3 w-3 text-red-400" />
                {idea.downvoteCount}
              </span>
              {idea.depth > 0 && (
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Reply
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
