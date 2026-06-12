'use client';

import { use } from 'react';
import { useWorkspace } from '@/features/workspaces/hooks/useWorkspaces';
import { usePermissions } from '@/hooks/usePermissions';
import { MemberManagement } from '@/features/workspaces/components/MemberManagement';
import { PageContainer } from '@/components/layout/PageContainer';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { Users } from 'lucide-react';

export default function WorkspaceMembersPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const { data: workspace, isPending } = useWorkspace(workspaceId);
  const { canManageWorkspace } = usePermissions(workspaceId);

  if (isPending) return <LoadingSkeleton variant="page" />;
  if (!workspace) return null;

  return (
    <PageContainer
      title="Members"
      description={`Manage members of ${workspace.name}`}
    >
      <MemberManagement workspace={workspace} canManage={canManageWorkspace} />
    </PageContainer>
  );
}
