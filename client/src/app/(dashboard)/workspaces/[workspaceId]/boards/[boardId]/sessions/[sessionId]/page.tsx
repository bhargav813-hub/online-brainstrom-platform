'use client';

import { use, useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { useSession, useJoinSession, useLeaveSession, useUpdateSession } from '@/features/sessions/hooks/useSession';
import { useIdeaHierarchy, useDeleteIdea } from '@/features/ideas/hooks/useIdeas';
import { useActivity } from '@/features/activity/hooks/useActivity';
import { useWorkspace } from '@/features/workspaces/hooks/useWorkspace';
import { ClusterList } from '@/features/clusters/components/ClusterList';
import { useSocket } from '@/providers/SocketProvider';
import { IdeaNode } from '@/features/ideas/components/IdeaNode';
import { CreateIdeaForm } from '@/features/ideas/components/CreateIdeaForm';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PageLoader } from '@/components/feedback/LoadingSpinner';
import { ErrorMessage } from '@/components/feedback/ErrorMessage';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Lightbulb, Users, Activity, Layers, Play, Pause, Square, Clock } from 'lucide-react';
import { formatRelativeTime } from '@/lib/formatters';
import { useAuthStore } from '@/store/auth.store';
import { getQueryClient } from '@/lib/query-client';
import { queryKeys } from '@/constants/query-keys';
import type { SessionStatus } from '@/types/session.types';

export default function SessionPage({ params }: { params: Promise<{ workspaceId: string; boardId: string; sessionId: string }> }) {
  const { workspaceId, boardId, sessionId } = use(params);
  const { data: session, isLoading: sessionLoading, error: sessionError, refetch } = useSession(sessionId);
  const { data: ideas, isLoading: ideasLoading } = useIdeaHierarchy(sessionId);
  const { data: activityData } = useActivity(sessionId);
  const { data: workspace } = useWorkspace(workspaceId);
  const joinSession = useJoinSession();
  const leaveSession = useLeaveSession();
  const updateSession = useUpdateSession(sessionId, boardId);
  const deleteIdea = useDeleteIdea(sessionId);
  const socket = useSocket();
  const { user } = useAuthStore();

  // Join session on mount, leave on unmount
  useEffect(() => {
    joinSession.mutate(sessionId);
    socket?.emit('session:join', { sessionId });

    return () => {
      leaveSession.mutate(sessionId);
      socket?.emit('session:leave', { sessionId });
    };
  }, [sessionId]);

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;
    const qc = getQueryClient();
    const handlers = {
      'idea:created': () => qc.invalidateQueries({ queryKey: queryKeys.ideas.hierarchy(sessionId) }),
      'idea:updated': () => qc.invalidateQueries({ queryKey: queryKeys.ideas.hierarchy(sessionId) }),
      'idea:deleted': () => qc.invalidateQueries({ queryKey: queryKeys.ideas.hierarchy(sessionId) }),
      'idea:moved': () => qc.invalidateQueries({ queryKey: queryKeys.ideas.hierarchy(sessionId) }),
      'vote:cast': () => qc.invalidateQueries({ queryKey: queryKeys.ideas.hierarchy(sessionId) }),
      'session:participants': () => qc.invalidateQueries({ queryKey: queryKeys.sessions.detail(sessionId) }),
    };

    Object.entries(handlers).forEach(([event, handler]) => socket.on(event, handler));
    return () => { Object.entries(handlers).forEach(([event, handler]) => socket.off(event, handler)); };
  }, [socket, sessionId]);

  if (sessionLoading || ideasLoading) return <PageLoader />;
  if (sessionError) return <PageContainer><ErrorMessage message="Failed to load session" retry={refetch} /></PageContainer>;

  const facilitator = typeof session?.facilitator === 'object' ? session.facilitator : null;
  const isFacilitator = facilitator?._id === user?._id;
  
  // Calculate if the user has workspace-level permissions to manage the session
  const isWorkspaceOwner = typeof workspace?.owner === 'object' 
    ? workspace?.owner?._id === user?._id 
    : workspace?.owner === user?._id;
    
  const memberRecord = workspace?.members?.find((m: any) => 
    typeof m.user === 'object' ? m.user._id === user?._id : m.user === user?._id
  );
  const isWorkspaceAdminOrFacilitator = isWorkspaceOwner || (memberRecord && ['workspace_admin', 'facilitator'].includes(memberRecord.role));
  
  const canManage = isFacilitator || isWorkspaceAdminOrFacilitator;
  
  const activeParticipants = session?.participants?.filter((p) => p.isActive) || [];

  const handleStatusChange = (status: SessionStatus) => {
    updateSession.mutate({ status });
  };

  return (
    <PageContainer>
      {/* Session header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{session?.title}</h1>
            {session && <StatusBadge status={session.status} />}
          </div>
          {session?.description && <p className="mt-1 text-muted-foreground">{session.description}</p>}
        </div>
        {isFacilitator && (
          <div className="flex gap-2">
            {session?.status === 'paused' && (
              <Button size="sm" onClick={() => handleStatusChange('active')} className="bg-emerald-600 hover:bg-emerald-700">
                <Play className="mr-1.5 h-4 w-4" />Resume
              </Button>
            )}
            {session?.status === 'active' && (
              <>
                <Button size="sm" variant="outline" onClick={() => handleStatusChange('paused')}>
                  <Pause className="mr-1.5 h-4 w-4" />Pause
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleStatusChange('ended')}>
                  <Square className="mr-1.5 h-4 w-4" />End
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Participants bar */}
      <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{activeParticipants.length} online</span>
        <div className="flex -space-x-2">
          {activeParticipants.slice(0, 8).map((p) => (
            <UserAvatar key={p.user._id} name={p.user.name} avatar={p.user.avatar} size="sm" className="ring-2 ring-background" />
          ))}
          {activeParticipants.length > 8 && (
            <Badge variant="secondary" className="ml-2">+{activeParticipants.length - 8}</Badge>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left — Ideas */}
        <div className="lg:col-span-2 space-y-4">
          {session?.status !== 'ended' && <CreateIdeaForm sessionId={sessionId} />}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Ideas ({ideas?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!ideas?.length ? (
                <EmptyState icon={Lightbulb} title="No ideas yet" description="Be the first to share an idea!" />
              ) : (
                <div role="tree" className="space-y-1">
                  {ideas.map((idea) => (
                    <IdeaNode key={idea._id} idea={idea} sessionId={sessionId} canEdit={canManage} onDelete={(id) => deleteIdea.mutate(id)} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right — Clusters & Activity */}
        <div className="space-y-4">
          <Tabs defaultValue="clusters">
            <TabsList className="w-full">
              <TabsTrigger value="clusters" className="flex-1"><Layers className="mr-1.5 h-4 w-4" />Clusters</TabsTrigger>
              <TabsTrigger value="activity" className="flex-1"><Activity className="mr-1.5 h-4 w-4" />Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="clusters">
              <Card>
                <CardContent className="pt-4">
                  <ClusterList sessionId={sessionId} canManage={canManage} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardContent className="pt-4">
                  <ScrollArea className="h-[400px]">
                    {!activityData?.data?.length ? (
                      <p className="text-center text-sm text-muted-foreground py-8">No activity yet</p>
                    ) : (
                      <div className="space-y-3">
                        {activityData.data.map((log) => (
                          <div key={log._id} className="flex items-start gap-3 text-sm">
                            <UserAvatar name={log.user?.name || 'User'} avatar={log.user?.avatar} size="sm" />
                            <div className="min-w-0 flex-1">
                              <p><span className="font-medium">{log.user?.name}</span>{' '}<span className="text-muted-foreground">{log.action.replace(/_/g, ' ')}</span></p>
                              <p className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{formatRelativeTime(log.createdAt)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
}
