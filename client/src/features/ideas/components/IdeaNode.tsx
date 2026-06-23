'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { VoteButtons } from '@/features/votes/components/VoteButtons';
import { IdeaVersionHistory } from './IdeaVersionHistory';
import { CreateIdeaForm } from './CreateIdeaForm';
import { EditIdeaForm } from './EditIdeaForm';
import type { Idea } from '@/types/idea.types';

interface IdeaNodeProps {
  idea: Idea;
  sessionId: string;
  depth?: number;
  canEdit?: boolean;
  onEdit?: (idea: Idea) => void;
  onDelete?: (ideaId: string) => void;
}

export function IdeaNode({ idea, sessionId, depth = 0, canEdit, onEdit, onDelete }: IdeaNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const [showAddChild, setShowAddChild] = useState(false);
  const author = typeof idea.author === 'object' ? idea.author : null;

  return (
    <div className="group/node" role="treeitem" aria-expanded={expanded}>
      <div className={cn('flex items-start gap-2 rounded-lg p-2 transition-colors hover:bg-muted/50', depth > 0 && 'ml-6 border-l-2 border-muted pl-4')}>
        <button onClick={() => setExpanded(!expanded)} className="mt-1 shrink-0 text-muted-foreground hover:text-foreground" aria-label={expanded ? 'Collapse' : 'Expand'}>
          <ChevronRight className={cn('h-4 w-4 transition-transform', expanded && 'rotate-90')} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-medium">{idea.title}</h4>
              {idea.content && <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{idea.content}</p>}
              <div className="mt-1 flex items-center gap-2">
                {author && <UserAvatar name={author.name} avatar={author.avatar} size="sm" />}
                {idea.tags?.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs">{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <VoteButtons ideaId={idea._id} sessionId={sessionId} upvotes={idea.upvoteCount} downvotes={idea.downvoteCount} />
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => setShowAddChild(!showAddChild)}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
              {canEdit && (
                <>
                  <IdeaVersionHistory ideaId={idea._id} sessionId={sessionId} />
                  <EditIdeaForm idea={idea} sessionId={sessionId} />
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => onDelete?.(idea._id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showAddChild && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="ml-12 overflow-hidden">
            <CreateIdeaForm sessionId={sessionId} parentIdeaId={idea._id} onSuccess={() => setShowAddChild(false)} compact />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {expanded && idea.children?.map((child) => (
          <motion.div key={child._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <IdeaNode idea={child} sessionId={sessionId} depth={depth + 1} canEdit={canEdit} onEdit={onEdit} onDelete={onDelete} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
