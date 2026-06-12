'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BoardForm } from '@/components/forms/BoardForm';
import { useCreateBoard } from '@/features/boards/hooks/useBoards';
import { ROUTES } from '@/constants/routes';
import { Layout } from 'lucide-react';

export default function NewBoardPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const router = useRouter();
  const createBoard = useCreateBoard();

  return (
    <PageContainer title="New Board" description="Create a new board for organizing sessions">
      <div className="max-w-lg">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-primary" />
              Create Board
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BoardForm
              workspaceId={workspaceId}
              onSubmit={(data) => {
                createBoard.mutate(data, {
                  onSuccess: () => router.push(ROUTES.WORKSPACE_DETAIL(workspaceId)),
                });
              }}
              isLoading={createBoard.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
