'use client';

import { use } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { BoardCard } from '@/features/boards/components/BoardCard';
import { CreateBoardModal } from '@/features/boards/components/CreateBoardModal';
import { useWorkspace } from '@/features/workspaces/hooks/useWorkspace';
import { useBoards } from '@/features/boards/hooks/useBoard';
import { useAuthStore } from '@/store/auth.store';
import { PageLoader } from '@/components/feedback/LoadingSpinner';
import { ErrorMessage } from '@/components/feedback/ErrorMessage';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import type { UserRole } from '@/constants/roles';

export default function WorkspaceDetailPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = use(params);
  const { data: workspace, isLoading: wsLoading } = useWorkspace(workspaceId);
  const { data: boards, isLoading: boardsLoading, error, refetch } = useBoards(workspaceId);
  const { user } = useAuthStore();

  const currentMember = workspace?.members?.find(
    (m) => (typeof m.user === 'object' ? m.user._id : m.user) === user?._id
  );
  const userRole = currentMember?.role as UserRole | undefined;

  if (wsLoading || boardsLoading) return <PageLoader />;
  if (error) return <PageContainer><ErrorMessage message="Failed to load boards" retry={refetch} /></PageContainer>;

  return (
    <PageContainer
      title={workspace?.name || 'Workspace'}
      description={workspace?.description}
      action={
        <div className="flex gap-2">
          <Link href={ROUTES.WORKSPACE_SETTINGS(workspaceId)}>
            <Button variant="outline"><Settings className="mr-2 h-4 w-4" />Settings</Button>
          </Link>
          <CreateBoardModal workspaceId={workspaceId} />
        </div>
      }
    >
      {!boards?.length ? (
        <EmptyState icon={FileText} title="No boards yet" description="Create a board to organize your sessions" action={<CreateBoardModal workspaceId={workspaceId} />} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board, i) => (
            <BoardCard key={board._id} board={board} workspaceId={workspaceId} userRole={userRole} index={i} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
