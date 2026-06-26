'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { WorkspaceCard } from '@/features/workspaces/components/WorkspaceCard';
import { CreateWorkspaceModal } from '@/features/workspaces/components/CreateWorkspaceModal';
import { useWorkspaces } from '@/features/workspaces/hooks/useWorkspace';
import { PageLoader } from '@/components/feedback/LoadingSpinner';
import { ErrorMessage } from '@/components/feedback/ErrorMessage';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FolderKanban } from 'lucide-react';

export default function WorkspacesPage() {
  const { data: workspaces, isLoading, error, refetch } = useWorkspaces();

  if (isLoading) return <PageLoader />;
  if (error) return <PageContainer><ErrorMessage message="Failed to load workspaces" retry={refetch} /></PageContainer>;

  return (
    <PageContainer
      title="Workspaces"
      description="Organize your brainstorming boards"
      action={<CreateWorkspaceModal />}
    >
      {!workspaces?.length ? (
        <EmptyState
          icon={FolderKanban}
          title="No workspaces yet"
          description="Create your first workspace to start brainstorming"
          action={<CreateWorkspaceModal />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((ws, i) => (
            <WorkspaceCard key={ws._id} workspace={ws} index={i} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
