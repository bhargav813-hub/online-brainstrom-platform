'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sharedService } from '@/services/shared.service';
import { SessionCard } from '@/features/sessions/components/SessionCard';
import { PageContainer } from '@/components/layout/PageContainer';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SharedBoardPage({
  params,
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = use(params);

  const { data, isPending } = useQuery({
    queryKey: ['shared', 'board', shareToken],
    queryFn: () => sharedService.getBoard(shareToken),
    enabled: !!shareToken,
  });

  if (isPending) return <LoadingSkeleton variant="page" />;
  if (!data) {
    return (
      <EmptyState
        icon={Zap}
        title="Board not found"
        description="This sharing link might be invalid, or guest access has been disabled by the owner."
      />
    );
  }

  const { board, sessions } = data;
  const activeSessions = sessions?.filter((s) => s.status === 'active') ?? [];
  const pausedSessions = sessions?.filter((s) => s.status === 'paused') ?? [];
  const endedSessions = sessions?.filter((s) => s.status === 'ended') ?? [];

  return (
    <PageContainer
      title={board.title}
      description={board.description || 'Board sessions (Guest access)'}
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
              {filtered.length === 0 ? (
                <EmptyState
                  icon={Zap}
                  title={`No ${tab} sessions`}
                  description={`${tab.charAt(0).toUpperCase() + tab.slice(1)} sessions will appear here.`}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {filtered.map((session) => (
                    <SessionCard
                      key={session._id}
                      session={session}
                      href={`/shared/${shareToken}/sessions/${session._id}`}
                    />
                  ))}
                </motion.div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </PageContainer>
  );
}
