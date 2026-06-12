'use client';

import Link from 'next/link';
import { useWorkspaces } from '@/features/workspaces/hooks/useWorkspaces';
import { WorkspaceCard } from '@/features/workspaces/components/WorkspaceCard';
import { PageContainer } from '@/components/layout/PageContainer';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { Plus, FolderKanban } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WorkspacesPage() {
  const { data: workspaces, isPending } = useWorkspaces();

  return (
    <PageContainer
      title="Workspaces"
      description="Manage your collaborative workspaces"
      action={
        <Link href={ROUTES.WORKSPACE_NEW}>
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" /> New Workspace
          </Button>
        </Link>
      }
    >
      {isPending ? (
        <LoadingSkeleton variant="card" count={6} />
      ) : !workspaces || workspaces.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No workspaces yet"
          description="Create your first workspace to start brainstorming with your team."
          action={
            <Link href={ROUTES.WORKSPACE_NEW}>
              <Button className="gap-1.5">
                <Plus className="h-4 w-4" /> Create Workspace
              </Button>
            </Link>
          }
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {workspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace._id}
              workspace={workspace}
            />
          ))}
        </motion.div>
      )}
    </PageContainer>
  );
}
