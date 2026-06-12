'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useUpdateWorkspace, useDeleteWorkspace } from '@/features/workspaces/hooks/useWorkspaces';
import { workspaceService } from '@/services/workspace.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkspaceForm } from '@/components/forms/WorkspaceForm';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { InviteUserForm } from '@/components/forms/InviteUserForm';
import { ROUTES } from '@/constants/routes';
import { Settings, Trash2, UserPlus } from 'lucide-react';
import type { Workspace } from '@/types/models';
import type { InviteUserInput } from '@/lib/validators';

interface WorkspaceSettingsProps {
  workspace: Workspace;
  canManage: boolean;
  canInvite: boolean;
}

export function WorkspaceSettings({ workspace, canManage, canInvite }: WorkspaceSettingsProps) {
  const router = useRouter();
  const updateWorkspace = useUpdateWorkspace(workspace._id);
  const deleteWorkspace = useDeleteWorkspace();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const inviteMutation = useMutation({
    mutationFn: (data: InviteUserInput) => workspaceService.invite(workspace._id, data),
    onSuccess: () => toast.success('Invitation sent'),
    onError: (error: { message: string }) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      {/* General Settings */}
      {canManage && (
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
      )}

      {/* Invite Members */}
      {canInvite && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Invite Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InviteUserForm
              onSubmit={(data) => inviteMutation.mutate(data)}
              isLoading={inviteMutation.isPending}
            />
          </CardContent>
        </Card>
      )}

      {/* Danger Zone */}
      {canManage && (
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
      )}

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Workspace"
        description={`Are you sure you want to delete "${workspace.name}"? This action cannot be undone.`}
        onConfirm={() => {
          deleteWorkspace.mutate(workspace._id, {
            onSuccess: () => router.push(ROUTES.WORKSPACES),
          });
        }}
        variant="destructive"
        loading={deleteWorkspace.isPending}
      />
    </div>
  );
}
