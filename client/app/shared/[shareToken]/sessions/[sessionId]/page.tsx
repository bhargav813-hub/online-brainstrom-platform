'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { sharedService } from '@/services/shared.service';
import { ParticipantList } from '@/features/sessions/components/ParticipantList';
import { ClusterManager } from '@/features/clusters/components/ClusterManager';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PageContainer } from '@/components/layout/PageContainer';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Activity, Download } from 'lucide-react';
import { ExportBoardDialog } from '@/features/ideas/components/ExportBoardDialog';

// Dynamic import for heavy tree component
const IdeaTree = dynamic(
  () => import('@/features/ideas/components/IdeaTree').then((m) => ({ default: m.IdeaTree })),
  { ssr: false, loading: () => <LoadingSkeleton variant="tree" /> }
);

export default function SharedSessionPage({
  params,
}: {
  params: Promise<{ shareToken: string; sessionId: string }>;
}) {
  const { shareToken, sessionId } = use(params);
  const [exportOpen, setExportOpen] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: ['shared', 'session', shareToken, sessionId],
    queryFn: () => sharedService.getSession(shareToken, sessionId),
    enabled: !!shareToken && !!sessionId,
  });

  if (isPending) return <LoadingSkeleton variant="page" />;
  if (!data) return null;

  const { session, participants } = data;

  return (
    <PageContainer
      title={session.title}
      description={session.description || 'Brainstorming session (Guest access)'}
      action={
        <div className="flex items-center gap-2">
          <StatusBadge status={session.status} />

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setExportOpen(true)}
          >
            <Download className="h-3.5 w-3.5" /> Export
          </Button>

          <Link href={`/shared/${shareToken}/sessions/${sessionId}/analytics`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" /> Analytics
            </Button>
          </Link>
          <Link href={`/shared/${shareToken}/sessions/${sessionId}/activity`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Activity className="h-3.5 w-3.5" /> Activity
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_300px] h-[calc(100vh-12rem)]">
        {/* Main content — Idea Tree */}
        <div id="idea-tree-export-root" className="border border-border/50 rounded-xl p-4 bg-card/30 overflow-hidden">
          <IdeaTree sessionId={sessionId} shareToken={shareToken} isReadOnly={true} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6 overflow-auto">
          <Tabs defaultValue="participants">
            <TabsList className="w-full">
              <TabsTrigger value="participants" className="flex-1">Participants</TabsTrigger>
              <TabsTrigger value="clusters" className="flex-1">Clusters</TabsTrigger>
            </TabsList>
            <TabsContent value="participants" className="mt-3">
              <ParticipantList
                sessionId={sessionId}
                participants={participants}
                canManage={false}
              />
            </TabsContent>
            <TabsContent value="clusters" className="mt-3">
              <ClusterManager sessionId={sessionId} canManage={false} shareToken={shareToken} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {exportOpen && (
        <ExportBoardDialog
          sessionId={sessionId}
          sessionTitle={session.title}
          shareToken={shareToken}
          open={exportOpen}
          onOpenChange={setExportOpen}
        />
      )}
    </PageContainer>
  );
}
