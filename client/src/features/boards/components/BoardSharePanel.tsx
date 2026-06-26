'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useShareBoard, useUnshareBoard } from '@/features/boards/hooks/useBoard';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { CopyButton } from '@/components/shared/CopyButton';
import { Share2, Globe, Lock, ExternalLink } from 'lucide-react';
import type { Board } from '@/types/board.types';

interface BoardSharePanelProps {
  board: Board;
}

export function BoardSharePanel({ board }: BoardSharePanelProps) {
  const shareBoard = useShareBoard();
  const unshareBoard = useUnshareBoard();
  const shareUrl = board.shareToken
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/shared/${board.shareToken}`
    : '';

  const handleToggleShare = () => {
    if (board.isPublic) {
      unshareBoard.mutate(board._id);
    } else {
      shareBoard.mutate(board._id);
    }
  };

  const isPending = shareBoard.isPending || unshareBoard.isPending;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Share2 className="h-4 w-4 text-violet-500" />
          Share Board
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {board.isPublic ? (
              <>
                <Globe className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Public — anyone with the link can view
                </span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Private — only members can access</span>
              </>
            )}
          </div>
          <Button
            size="sm"
            variant={board.isPublic ? 'destructive' : 'default'}
            onClick={handleToggleShare}
            disabled={isPending}
            className={!board.isPublic ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700' : ''}
          >
            {board.isPublic ? 'Disable Sharing' : 'Enable Sharing'}
          </Button>
        </div>

        {board.isPublic && shareUrl && (
          <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
            <code className="flex-1 truncate text-sm">{shareUrl}</code>
            <CopyButton text={shareUrl} />
            <a href={shareUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
