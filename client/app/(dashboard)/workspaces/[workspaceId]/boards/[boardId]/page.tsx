'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useBoard } from '@/features/boards/hooks/useBoards';
import { useSessions } from '@/features/sessions/hooks/useSessions';
import { useJoinSession } from '@/features/sessions/hooks/useSessions';
import { usePermissions } from '@/hooks/usePermissions';
import { SessionCard } from '@/features/sessions/components/SessionCard';
import { PageContainer } from '@/components/layout/PageContainer';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROUTES } from '@/constants/routes';
import { Plus, Zap, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ShareBoardDialog } from '@/features/boards/components/ShareBoardDialog';

export default function BoardDetailPage({
  params,
}: {
  params: Promise<{ workspaceId: string; boardId: string }>;
}) {
  const { workspaceId, boardId } = use(params);
  const { data: board, isPending: boardLoading } = useBoard(boardId);
  const { data: sessions, isPending: sessionsLoading } = useSessions(boardId);
  const { canManageSessions } = usePermissions(workspaceId);
  const joinSession = useJoinSession();
  const [shareOpen, setShareOpen] = useState(false);

  if (boardLoading) return <LoadingSkeleton variant="page" />;
  if (!board) return null;

  const activeSessions = sessions?.filter((s) => s.status === 'active') ?? [];
  const pausedSessions = sessions?.filter((s) => s.status === 'paused') ?? [];
  const endedSessions = sessions?.filter((s) => s.status === 'ended') ?? [];

  return (
    <PageContainer
      title={board.title}
      description={board.description || 'Board sessions'}
      action={
        <div className="flex items-center gap-2">
          {canManageSessions && (
            <Button variant="outline" className="gap-1.5" onClick={() => setShareOpen(true)}>
              <Share2 className="h-4 w-4" /> Share
            </Button>
          )}
          {canManageSessions ? (
            <Link href={ROUTES.SESSION_NEW(workspaceId, boardId)}>
              <Button className="gap-1.5">
                <Plus className="h-4 w-4" /> New Session
              </Button>
            </Link>
          ) : undefined}
        </div>
      }
    >
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({activeSessions.length})</TabsTrigger>
          <TabsTrigger value="paused">Paused ({pausedSessions.length})</TabsTrigger>
          <TabsTrigger value="ended">Ended ({endedSessions.length})</TabsTrigger>
        </TabsList>

        {['active', 'paused', 'ended'].map((tab) => {
          const filtered =
            tab === 'active' ? activeSessions : tab === 'paused' ? pausedSessions : endedSessions;
          return (
            <TabsContent key={tab} value={tab} className="mt-4">
              {sessionsLoading ? (
                <LoadingSkeleton variant="card" count={3} />
              ) : filtered.length === 0 ? (
                <EmptyState
                  icon={Zap}
                  title={`No ${tab} sessions`}
                  description={tab === 'active' ? 'Start a new session to begin brainstorming.' : `${tab.charAt(0).toUpperCase() + tab.slice(1)} sessions will appear here.`}
                />
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((session) => (
                    <SessionCard
                      key={session._id}
                      session={session}
                      href={ROUTES.SESSION_DETAIL(workspaceId, boardId, session._id)}
                      onJoin={() => joinSession.mutate(session._id)}
                      isJoining={joinSession.isPending}
                    />
                  ))}
                </motion.div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
      {shareOpen && (
        <ShareBoardDialog
          board={board}
          open={shareOpen}
          onOpenChange={setShareOpen}
        />
      )}
    </PageContainer>
  );
}
