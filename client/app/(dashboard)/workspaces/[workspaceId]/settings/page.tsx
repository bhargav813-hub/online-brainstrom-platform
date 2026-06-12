'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspace, useUpdateWorkspace, useDeleteWorkspace } from '@/features/workspaces/hooks/useWorkspaces';
import { PageContainer } from '@/components/layout/PageContainer';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkspaceForm } from '@/components/forms/WorkspaceForm';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const router = useRouter();
  const { data: workspace, isPending } = useWorkspace(workspaceId);
  const updateWorkspace = useUpdateWorkspace(workspaceId);
  const deleteWorkspace = useDeleteWorkspace();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (isPending) return <LoadingSkeleton variant="page" />;
  if (!workspace) return null;

  return (
    <PageContainer title="Workspace Settings" description={`Settings for ${workspace.name}`}>
      <div className="max-w-lg space-y-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WorkspaceForm
              defaultValues={{ name: workspace.name, description: workspace.description }}
              onSubmit={(data) => updateWorkspace.mutate(data)}
              isLoading={updateWorkspace.isPending}
              submitLabel="Save Changes"
            />
          </CardContent>
        </Card>

        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Deleting this workspace is permanent. All boards, sessions, and data will be lost.
            </p>
            <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
              Delete Workspace
            </Button>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Workspace"
        description={`Are you sure you want to delete "${workspace.name}"? This action cannot be undone.`}
        onConfirm={() => {
          deleteWorkspace.mutate(workspaceId, {
            onSuccess: () => router.push(ROUTES.WORKSPACES),
          });
        }}
        variant="destructive"
      />
    </PageContainer>
  );
}
