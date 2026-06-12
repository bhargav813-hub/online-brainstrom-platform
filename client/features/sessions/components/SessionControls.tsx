'use client';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { useUpdateSession } from '@/features/sessions/hooks/useSessions';
import { Pause, Play, Square } from 'lucide-react';
import { useState } from 'react';
import type { SessionStatus } from '@/types/common';

interface SessionControlsProps {
  sessionId: string;
  boardId: string;
  status: SessionStatus;
  canManage: boolean;
}

export function SessionControls({ sessionId, boardId, status, canManage }: SessionControlsProps) {
  const [confirmEnd, setConfirmEnd] = useState(false);
  const updateSession = useUpdateSession(sessionId, boardId);

  if (!canManage || status === 'ended') return null;

  const handleStatusChange = (newStatus: SessionStatus) => {
    updateSession.mutate({ status: newStatus });
  };

  return (
    <div className="flex items-center gap-2">
      {status === 'active' && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('paused')}
            disabled={updateSession.isPending}
            className="gap-1.5"
          >
            <Pause className="h-3.5 w-3.5" />
            Pause
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmEnd(true)}
            disabled={updateSession.isPending}
            className="gap-1.5"
          >
            <Square className="h-3.5 w-3.5" />
            End Session
          </Button>
        </>
      )}

      {status === 'paused' && (
        <>
          <Button
            variant="default"
            size="sm"
            onClick={() => handleStatusChange('active')}
            disabled={updateSession.isPending}
            className="gap-1.5"
          >
            <Play className="h-3.5 w-3.5" />
            Resume
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmEnd(true)}
            disabled={updateSession.isPending}
            className="gap-1.5"
          >
            <Square className="h-3.5 w-3.5" />
            End Session
          </Button>
        </>
      )}

      <ConfirmDialog
        open={confirmEnd}
        onOpenChange={setConfirmEnd}
        title="End Session"
        description="Are you sure you want to end this session? This action cannot be undone. All participants will be notified."
        onConfirm={() => handleStatusChange('ended')}
        variant="destructive"
      />
    </div>
  );
}
