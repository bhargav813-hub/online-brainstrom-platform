'use client';

import { IdeaNode } from './IdeaNode';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Lightbulb } from 'lucide-react';
import type { Idea } from '@/types/idea.types';

interface IdeaTreeProps {
  ideas: Idea[];
  sessionId: string;
  canEdit: boolean;
  onDelete: (ideaId: string) => void;
}

export function IdeaTree({ ideas, sessionId, canEdit, onDelete }: IdeaTreeProps) {
  if (!ideas?.length) {
    return (
      <EmptyState
        icon={Lightbulb}
        title="No ideas yet"
        description="Be the first to share an idea!"
      />
    );
  }

  return (
    <div role="tree" aria-label="Idea hierarchy" className="space-y-1">
      {ideas.map((idea) => (
        <IdeaNode
          key={idea._id}
          idea={idea}
          sessionId={sessionId}
          canEdit={canEdit}
          onDelete={onDelete}
          depth={0}
        />
      ))}
    </div>
  );
}
