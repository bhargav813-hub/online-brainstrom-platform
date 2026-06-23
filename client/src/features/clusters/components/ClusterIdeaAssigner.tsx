'use client';

import { useState } from 'react';
import { useIdeaHierarchy } from '@/features/ideas/hooks/useIdeas';
import { useAddIdeasToCluster } from '@/features/clusters/hooks/useCluster';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Loader2, Check } from 'lucide-react';
import type { Idea } from '@/types/idea.types';

interface ClusterIdeaAssignerProps {
  clusterId: string;
  sessionId: string;
  existingIdeaIds: string[];
}

export function ClusterIdeaAssigner({ clusterId, sessionId, existingIdeaIds }: ClusterIdeaAssignerProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const { data: ideas } = useIdeaHierarchy(sessionId);
  const addIdeas = useAddIdeasToCluster(sessionId);

  const flattenIdeas = (ideas: Idea[]): Idea[] => {
    const flat: Idea[] = [];
    const walk = (list: Idea[]) => {
      for (const idea of list) {
        flat.push(idea);
        if (idea.children) walk(idea.children);
      }
    };
    walk(ideas || []);
    return flat;
  };

  const allIdeas = flattenIdeas(ideas || []);
  const available = allIdeas.filter((i) => !existingIdeaIds.includes(i._id));

  const toggleIdea = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleAdd = () => {
    if (!selected.length) return;
    addIdeas.mutate(
      { clusterId, payload: { ideaIds: selected } },
      {
        onSuccess: () => {
          setOpen(false);
          setSelected([]);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Plus className="h-3.5 w-3.5" />
          Add Ideas
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Ideas to Cluster</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[350px]">
          <div className="space-y-1 pr-4">
            {available.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">All ideas are already in this cluster</p>
            ) : (
              available.map((idea) => (
                <button
                  key={idea._id}
                  type="button"
                  onClick={() => toggleIdea(idea._id)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    selected.includes(idea._id)
                      ? 'bg-violet-500/10 text-violet-700 dark:text-violet-400'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                    selected.includes(idea._id)
                      ? 'border-violet-600 bg-violet-600 text-white'
                      : 'border-muted-foreground/30'
                  }`}>
                    {selected.includes(idea._id) && <Check className="h-3 w-3" />}
                  </div>
                  <span className="truncate">{idea.title}</span>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAdd}
            disabled={!selected.length || addIdeas.isPending}
            className="bg-gradient-to-r from-violet-600 to-indigo-600"
          >
            {addIdeas.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Add {selected.length} idea{selected.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
