'use client';

import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkspaceForm } from '@/components/forms/WorkspaceForm';
import { useCreateWorkspace } from '@/features/workspaces/hooks/useWorkspaces';
import { ROUTES } from '@/constants/routes';
import { FolderKanban } from 'lucide-react';

export default function NewWorkspacePage() {
  const router = useRouter();
  const createWorkspace = useCreateWorkspace();

  return (
    <PageContainer title="New Workspace" description="Create a new collaborative workspace">
      <div className="max-w-lg">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />
              Create Workspace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WorkspaceForm
              onSubmit={(data) => {
                createWorkspace.mutate(data, {
                  onSuccess: () => router.push(ROUTES.WORKSPACES),
                });
              }}
              isLoading={createWorkspace.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
