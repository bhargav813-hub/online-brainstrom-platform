'use client';

import { use } from 'react';
import { ActivityFeed } from '@/features/activity/components/ActivityFeed';
import { PageContainer } from '@/components/layout/PageContainer';

export default function SharedSessionActivityPage({
  params,
}: {
  params: Promise<{ shareToken: string; sessionId: string }>;
}) {
  const { shareToken, sessionId } = use(params);

  return (
    <PageContainer title="Activity Log" description="Timeline of all session events (Guest Access)">
      <div className="max-w-2xl">
        <ActivityFeed sessionId={sessionId} limit={50} shareToken={shareToken} />
      </div>
    </PageContainer>
  );
}
