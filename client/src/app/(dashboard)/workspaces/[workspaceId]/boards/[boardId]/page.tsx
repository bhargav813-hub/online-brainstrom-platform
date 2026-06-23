'use client';

import { use } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { SessionCard } from '@/features/sessions/components/SessionCard';
import { CreateSessionModal } from '@/features/sessions/components/CreateSessionModal';
import { useBoard } from '@/features/boards/hooks/useBoard';
import { useSessions } from '@/features/sessions/hooks/useSession';
import { PageLoader } from '@/components/feedback/LoadingSpinner';
import { ErrorMessage } from '@/components/feedback/ErrorMessage';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Sparkles, Download, FileJson, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BoardSharePanel } from '@/features/boards/components/BoardSharePanel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useExportBoard } from '@/features/boards/hooks/useBoard';

export default function BoardDetailPage({ params }: { params: Promise<{ workspaceId: string; boardId: string }> }) {
  const { workspaceId, boardId } = use(params);
  const { data: board, isLoading: boardLoading } = useBoard(boardId);
  const { data: sessions, isLoading: sessionsLoading, error, refetch } = useSessions(boardId);

  const exportBoard = useExportBoard();

  if (boardLoading || sessionsLoading) return <PageLoader />;
  if (error) return <PageContainer><ErrorMessage message="Failed to load sessions" retry={refetch} /></PageContainer>;

  return (
    <PageContainer
      title={board?.name || 'Board'}
      description={board?.description}
      action={
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={exportBoard.isPending}>
                {exportBoard.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportBoard.mutate({ boardId, format: 'json' })}>
                <FileJson className="mr-2 h-4 w-4 text-emerald-500" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportBoard.mutate({ boardId, format: 'pdf' })}>
                <FileText className="mr-2 h-4 w-4 text-rose-500" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CreateSessionModal boardId={boardId} workspaceId={workspaceId} />
        </div>
      }
    >
      <div className="mb-6">
        {board && <BoardSharePanel board={board} />}
      </div>
      {!sessions?.length ? (
        <EmptyState icon={Sparkles} title="No sessions yet" description="Start a brainstorming session to generate ideas" action={<CreateSessionModal boardId={boardId} workspaceId={workspaceId} />} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session, i) => (
            <SessionCard key={session._id} session={session} workspaceId={workspaceId} boardId={boardId} index={i} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
