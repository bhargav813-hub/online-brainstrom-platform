'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SessionForm } from '@/components/forms/SessionForm';
import { useCreateSession } from '@/features/sessions/hooks/useSessions';
import { ROUTES } from '@/constants/routes';
import { Zap } from 'lucide-react';

export default function NewSessionPage({
  params,
}: {
  params: Promise<{ workspaceId: string; boardId: string }>;
}) {
  const { workspaceId, boardId } = use(params);
  const router = useRouter();
  const createSession = useCreateSession();

  return (
    <PageContainer title="New Session" description="Configure a new brainstorming session">
      <div className="max-w-lg">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Create Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SessionForm
              boardId={boardId}
              workspaceId={workspaceId}
              onSubmit={(data) => {
                createSession.mutate(data, {
                  onSuccess: () =>
                    router.push(ROUTES.BOARD_DETAIL(workspaceId, boardId)),
                });
              }}
              isLoading={createSession.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
