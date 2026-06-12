'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { IdeaForm } from '@/components/forms/IdeaForm';
import { VoteButtons } from '@/features/votes/components/VoteButtons';
import { formatRelativeTime, cn } from '@/lib/utils';
import { useCreateIdea, useDeleteIdea } from '@/features/ideas/hooks/useIdeas';
import {
  ChevronRight,
  MessageSquare,
  Trash2,
  History,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { IdeaNode as IdeaNodeType } from '@/types/models';
import { motion, AnimatePresence } from 'framer-motion';

interface IdeaNodeProps {
  node: IdeaNodeType;
  sessionId: string;
  onViewVersions?: (ideaId: string) => void;
  isAuthor?: boolean;
  isReadOnly?: boolean;
}

export function IdeaNode({ node, sessionId, onViewVersions, isAuthor, isReadOnly = false }: IdeaNodeProps) {
  const [isExpanded, setIsExpanded] = useState(node.depth < 2);
  const [isReplying, setIsReplying] = useState(false);
  const createIdea = useCreateIdea(sessionId);
  const deleteIdea = useDeleteIdea(sessionId);

  if (node.isDeleted) return null;

  return (
    <div className="group">
      <div
        className={cn(
          'flex items-start gap-2 rounded-lg px-3 py-2.5 transition-all duration-200',
          'hover:bg-accent/40 border border-transparent hover:border-border/40'
        )}
      >
        {/* Expand toggle */}
        {node.children.length > 0 ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 flex-shrink-0 p-0.5 rounded hover:bg-accent"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <ChevronRight
              className={cn(
                'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200',
                isExpanded && 'rotate-90'
              )}
            />
          </button>
        ) : (
          <div className="w-[18px] flex-shrink-0" />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight">{node.title}</p>
              {node.content && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {node.content}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                <UserAvatar name={node.author.name} avatar={node.author.avatar} size="xs" />
                <span>{node.author.name}</span>
                <span>·</span>
                <span>{formatRelativeTime(node.createdAt)}</span>
                {node.currentVersion > 1 && (
                  <span className="text-primary">v{node.currentVersion}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!isReadOnly && (
                <>
                  <VoteButtons
                    ideaId={node._id}
                    sessionId={sessionId}
                    upvoteCount={node.upvoteCount}
                    downvoteCount={node.downvoteCount}
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setIsReplying(!isReplying)}
                  >
                    <MessageSquare className="h-3 w-3" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent transition-colors cursor-pointer outline-none">
                        <MoreHorizontal className="h-3 w-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => onViewVersions?.(node._id)}>
                        <History className="mr-2 h-3.5 w-3.5" />
                        Version History
                      </DropdownMenuItem>
                      {isAuthor && (
                        <DropdownMenuItem
                          onClick={() => deleteIdea.mutate(node._id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>

          {/* Reply form */}
          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2"
              >
                <IdeaForm
                  sessionId={sessionId}
                  parentIdeaId={node._id}
                  onSubmit={(data) => {
                    createIdea.mutate(data);
                    setIsReplying(false);
                  }}
                  isLoading={createIdea.isPending}
                  compact
                  onCancel={() => setIsReplying(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Children */}
      <AnimatePresence>
        {isExpanded && node.children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-6 pl-3 border-l-2 border-border/30"
          >
            {node.children.map((child) => (
              <IdeaNode
                key={child._id}
                node={child}
                sessionId={sessionId}
                onViewVersions={onViewVersions}
                isAuthor={isAuthor}
                isReadOnly={isReadOnly}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
