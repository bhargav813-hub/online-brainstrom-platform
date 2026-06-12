'use client';

import { use } from 'react';
import Link from 'next/link';
import { useWorkspace } from '@/features/workspaces/hooks/useWorkspaces';
import { useBoards } from '@/features/boards/hooks/useBoards';
import { useArchiveBoard, useUnarchiveBoard } from '@/features/boards/hooks/useBoards';
import { usePermissions } from '@/hooks/usePermissions';
import { BoardCard } from '@/features/boards/components/BoardCard';
import { PageContainer } from '@/components/layout/PageContainer';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROUTES } from '@/constants/routes';
import { Plus, Layout, Settings, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WorkspaceDetailPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const { data: workspace, isPending: wsLoading } = useWorkspace(workspaceId);
  const { data: boards, isPending: boardsLoading } = useBoards(workspaceId, true);
  const { canManageWorkspace, canArchiveBoards, canInviteMembers } = usePermissions(workspaceId);
  const archiveBoard = useArchiveBoard(workspaceId);
  const unarchiveBoard = useUnarchiveBoard(workspaceId);

  if (wsLoading) return <LoadingSkeleton variant="page" />;
  if (!workspace) return null;

  const activeBoards = boards?.filter((b) => !b.isArchived) ?? [];
  const archivedBoards = boards?.filter((b) => b.isArchived) ?? [];

  return (
    <PageContainer
      title={workspace.name}
      description={workspace.description || 'Workspace overview'}
      action={
        <div className="flex items-center gap-2">
          {canInviteMembers && (
            <Link href={ROUTES.WORKSPACE_MEMBERS(workspaceId)}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Users className="h-3.5 w-3.5" /> Members
                <Badge variant="secondary" className="ml-1 text-[10px]">
                  {workspace.members.length}
                </Badge>
              </Button>
            </Link>
          )}
          {canManageWorkspace && (
            <Link href={ROUTES.WORKSPACE_SETTINGS(workspaceId)}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Settings className="h-3.5 w-3.5" /> Settings
              </Button>
            </Link>
          )}
          <Link href={ROUTES.BOARD_NEW(workspaceId)}>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> New Board
            </Button>
          </Link>
        </div>
      }
    >
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">
            Active Boards ({activeBoards.length})
          </TabsTrigger>
          <TabsTrigger value="archived">
            Archived ({archivedBoards.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          {boardsLoading ? (
            <LoadingSkeleton variant="card" count={4} />
          ) : activeBoards.length === 0 ? (
            <EmptyState
              icon={Layout}
              title="No boards yet"
              description="Create a board to organize your brainstorming sessions."
              action={
                <Link href={ROUTES.BOARD_NEW(workspaceId)}>
                  <Button className="gap-1.5">
                    <Plus className="h-4 w-4" /> Create Board
                  </Button>
                </Link>
              }
            />
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeBoards.map((board) => (
                <BoardCard
                  key={board._id}
                  board={board}
                  workspaceId={workspaceId}
                  href={ROUTES.BOARD_DETAIL(workspaceId, board._id)}
                  canArchive={canArchiveBoards}
                  onArchive={() => archiveBoard.mutate(board._id)}
                />
              ))}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="mt-4">
          {archivedBoards.length === 0 ? (
            <EmptyState
              icon={Layout}
              title="No archived boards"
              description="Archived boards will appear here."
            />
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {archivedBoards.map((board) => (
                <BoardCard
                  key={board._id}
                  board={board}
                  workspaceId={workspaceId}
                  href={ROUTES.BOARD_DETAIL(workspaceId, board._id)}
                  canArchive={canArchiveBoards}
                  onUnarchive={() => unarchiveBoard.mutate(board._id)}
                />
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
