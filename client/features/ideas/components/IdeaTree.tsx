'use client';

import { useState } from 'react';
import { IdeaNode } from './IdeaNode';
import { IdeaForm } from '@/components/forms/IdeaForm';
import { IdeaVersionHistory } from './IdeaVersionHistory';
import { IdeaSearchBar } from './IdeaSearchBar';
import { useIdeaTree } from '@/features/ideas/hooks/useIdeaTree';
import { useIdeaSocket } from '@/features/ideas/hooks/useIdeaSocket';
import { useCreateIdea } from '@/features/ideas/hooks/useIdeas';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { useAuthStore } from '@/store/auth.store';
import { Lightbulb, TreePine } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

interface IdeaTreeProps {
  sessionId: string;
  shareToken?: string;
  isReadOnly?: boolean;
}

export function IdeaTree({ sessionId, shareToken, isReadOnly = false }: IdeaTreeProps) {
  const { tree, isPending, flatIdeas } = useIdeaTree(sessionId, shareToken);
  const { user } = useAuthStore();
  const createIdea = useCreateIdea(sessionId);
  const [versionHistoryIdeaId, setVersionHistoryIdeaId] = useState<string | null>(null);

  // Subscribe to socket events for real-time updates
  useIdeaSocket(sessionId);

  if (isPending) {
    return <LoadingSkeleton variant="list" count={5} />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with search */}
      <div className="flex items-center gap-3 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <TreePine className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Idea Tree</h3>
            <p className="text-[10px] text-muted-foreground">
              {flatIdeas.filter((i) => !i.isDeleted).length} ideas
            </p>
          </div>
        </div>
        <div className="ml-auto flex-1 max-w-xs">
          <IdeaSearchBar sessionId={sessionId} />
        </div>
      </div>

      {/* Add idea form */}
      {!isReadOnly && (
        <div className="pb-4 border-b border-border/50">
          <IdeaForm
            sessionId={sessionId}
            onSubmit={(data) => createIdea.mutate(data)}
            isLoading={createIdea.isPending}
            compact
          />
        </div>
      )}

      {/* Tree content */}
      <ScrollArea className="flex-1 pt-2">
        {tree.length === 0 ? (
          <EmptyState
            icon={Lightbulb}
            title="No ideas yet"
            description="Be the first to add an idea! Start brainstorming above."
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-0.5"
          >
            {tree.map((node) => (
              <IdeaNode
                key={node._id}
                node={node}
                sessionId={sessionId}
                onViewVersions={(id) => setVersionHistoryIdeaId(id)}
                isAuthor={node.author?._id === user?._id}
                isReadOnly={isReadOnly}
              />
            ))}
          </motion.div>
        )}
      </ScrollArea>

      {/* Version history dialog */}
      {versionHistoryIdeaId && (
        <IdeaVersionHistory
          ideaId={versionHistoryIdeaId}
          sessionId={sessionId}
          open={!!versionHistoryIdeaId}
          onOpenChange={(open) => !open && setVersionHistoryIdeaId(null)}
        />
      )}
    </div>
  );
}
