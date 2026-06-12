'use client';

import { use } from 'react';
import { ActivityFeed } from '@/features/activity/components/ActivityFeed';
import { PageContainer } from '@/components/layout/PageContainer';

export default function SessionActivityPage({
  params,
}: {
  params: Promise<{ workspaceId: string; boardId: string; sessionId: string }>;
}) {
  const { sessionId } = use(params);

  return (
    <PageContainer title="Activity Log" description="Timeline of all session events">
      <div className="max-w-2xl">
        <ActivityFeed sessionId={sessionId} limit={50} />
      </div>
    </PageContainer>
  );
}
