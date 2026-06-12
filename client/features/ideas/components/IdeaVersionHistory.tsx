'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useIdeaVersions, useRestoreIdeaVersion } from '@/features/ideas/hooks/useIdeas';
import { formatRelativeTime } from '@/lib/utils';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { RotateCcw, Loader2, FileText } from 'lucide-react';
import type { IdeaVersion } from '@/types/models';

interface IdeaVersionHistoryProps {
  ideaId: string;
  sessionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IdeaVersionHistory({
  ideaId,
  sessionId,
  open,
  onOpenChange,
}: IdeaVersionHistoryProps) {
  const { data: versions, isPending } = useIdeaVersions(ideaId);
  const restoreVersion = useRestoreIdeaVersion(sessionId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg glass-strong">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Version History
          </DialogTitle>
          <DialogDescription>
            View and restore previous versions of this idea.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px]">
          {isPending ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : !versions || versions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No version history available.
            </p>
          ) : (
            <div className="space-y-1">
              {versions.map((version: IdeaVersion, index: number) => (
                <div key={version._id}>
                  <div className="flex items-start gap-3 py-3 px-2 rounded-lg hover:bg-accent/30 transition-colors">
                    <Badge
                      variant={index === 0 ? 'default' : 'outline'}
                      className="text-[10px] mt-0.5 flex-shrink-0"
                    >
                      v{version.version}
                    </Badge>

                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-medium">{version.title}</p>
                      {version.content && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {version.content}
                        </p>
                      )}
                      {version.changeNote && (
                        <p className="text-xs italic text-muted-foreground/70">
                          &ldquo;{version.changeNote}&rdquo;
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <UserAvatar name={version.editedBy.name} size="xs" />
                        <span>{version.editedBy.name}</span>
                        <span>·</span>
                        <span>{formatRelativeTime(version.createdAt)}</span>
                      </div>
                    </div>

                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0 text-xs h-7"
                        onClick={() =>
                          restoreVersion.mutate({ ideaId, version: version.version })
                        }
                        disabled={restoreVersion.isPending}
                      >
                        <RotateCcw className="mr-1 h-3 w-3" />
                        Restore
                      </Button>
                    )}
                  </div>
                  {index < versions.length - 1 && <Separator className="opacity-30" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
