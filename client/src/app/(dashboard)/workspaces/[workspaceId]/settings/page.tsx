'use client';

import { use } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { useWorkspace, useDeleteWorkspace } from '@/features/workspaces/hooks/useWorkspace';
import { InviteMemberForm } from '@/features/workspaces/components/InviteMemberForm';
import { MemberList } from '@/features/workspaces/components/MemberList';
import { useAuthStore } from '@/store/auth.store';
import { PageLoader } from '@/components/feedback/LoadingSpinner';
import { ErrorMessage } from '@/components/feedback/ErrorMessage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { UserRole } from '@/constants/roles';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { Loader2, AlertTriangle, Trash2 } from 'lucide-react';

export default function WorkspaceSettingsPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = use(params);
  const { data: workspace, isLoading, error, refetch } = useWorkspace(workspaceId);
  const deleteWorkspace = useDeleteWorkspace();
  const { user } = useAuthStore();
  const router = useRouter();

  const currentMember = workspace?.members?.find(
    (m) => (typeof m.user === 'object' ? m.user._id : m.user) === user?._id
  );
  const userRole = currentMember?.role as UserRole | undefined;

  const isOwner = typeof workspace?.owner === 'object' 
    ? workspace.owner._id === user?._id 
    : workspace?.owner === user?._id;
  
  const canManage = isOwner || userRole === 'workspace_admin';

  if (isLoading) return <PageLoader />;
  if (error) return <PageContainer><ErrorMessage message="Failed to load settings" retry={refetch} /></PageContainer>;

  return (
    <PageContainer title="Workspace Settings" description={workspace?.name}>
      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader><CardTitle>Invite Members</CardTitle></CardHeader>
          <CardContent>
            <InviteMemberForm workspaceId={workspaceId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Members ({workspace?.members?.length || 0})</CardTitle></CardHeader>
          <CardContent>
            <MemberList members={workspace?.members || []} workspaceId={workspaceId} currentUserRole={userRole} />
          </CardContent>
        </Card>

        {canManage && (
          <Card className="overflow-hidden border-rose-500/20 bg-gradient-to-br from-rose-500/5 via-background to-background relative shadow-sm">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-500 to-rose-700" />
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="h-5 w-5" />
                Workspace Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-xl border border-rose-500/10 bg-rose-500/5 p-4 sm:p-6 transition-colors hover:bg-rose-500/10">
                <div className="space-y-1">
                  <h4 className="font-semibold text-rose-900 dark:text-rose-200">Delete this workspace</h4>
                  <p className="text-sm leading-relaxed text-rose-600/80 dark:text-rose-300/80 max-w-lg">
                    Once you delete a workspace, there is no going back. This will permanently erase all boards, sessions, and ideas associated with it. Please be certain.
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  className="shrink-0 shadow-lg shadow-rose-500/20 transition-all hover:scale-105 hover:shadow-rose-500/30 font-medium"
                  onClick={() => {
                    if (window.confirm('Are you absolutely sure you want to permanently delete this workspace? This action cannot be undone.')) {
                      deleteWorkspace.mutate(workspaceId, {
                        onSuccess: () => router.push(ROUTES.WORKSPACES)
                      });
                    }
                  }}
                  disabled={deleteWorkspace.isPending}
                >
                  {deleteWorkspace.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete Workspace
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
