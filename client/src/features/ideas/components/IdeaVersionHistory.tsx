'use client';

import { useState } from 'react';
import { useIdeaVersions, useRestoreVersion } from '@/features/ideas/hooks/useIdeas';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { formatRelativeTime } from '@/lib/formatters';
import { History, RotateCcw, Clock } from 'lucide-react';

interface IdeaVersionHistoryProps {
  ideaId: string;
  sessionId: string;
}

export function IdeaVersionHistory({ ideaId, sessionId }: IdeaVersionHistoryProps) {
  const [open, setOpen] = useState(false);
  const { data: versions, isLoading } = useIdeaVersions(ideaId);
  const restoreVersion = useRestoreVersion(sessionId);

  const handleRestore = (version: number) => {
    restoreVersion.mutate({ ideaId, version }, { onSuccess: () => setOpen(false) });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <History className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-violet-500" />
            Version History
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <LoadingSpinner />
        ) : !versions?.length ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No version history available</p>
        ) : (
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-3 pr-4">
              {versions.map((v) => (
                <div key={v._id} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">v{v.version}</Badge>
                      <span className="text-sm font-medium">{v.title}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleRestore(v.version)}
                      disabled={restoreVersion.isPending}
                    >
                      <RotateCcw className="mr-1 h-3 w-3" />
                      Restore
                    </Button>
                  </div>
                  {v.content && <p className="text-xs text-muted-foreground line-clamp-2">{v.content}</p>}
                  {v.changeNote && (
                    <p className="text-xs italic text-muted-foreground">&quot;{v.changeNote}&quot;</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>by {v.editedBy?.name || 'Unknown'}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(v.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
