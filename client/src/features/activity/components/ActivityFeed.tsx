'use client';

import { useState } from 'react';
import { useActivity, useFilteredActivity } from '@/features/activity/hooks/useActivity';
import { ActivityItem } from './ActivityItem';
import { ActivityFilter } from './ActivityFilter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { Activity } from 'lucide-react';

interface ActivityFeedProps {
  sessionId: string;
  maxHeight?: string;
}

export function ActivityFeed({ sessionId, maxHeight = '400px' }: ActivityFeedProps) {
  const [filter, setFilter] = useState('all');
  const allActivity = useActivity(sessionId);
  const filteredActivity = useFilteredActivity(sessionId, filter === 'all' ? '' : filter);

  const activityData = filter === 'all' ? allActivity : filteredActivity;
  const activities = filter === 'all'
    ? (allActivity.data?.data || [])
    : (filteredActivity.data?.data || []);
  const isLoading = activityData.isLoading;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Activity className="h-4 w-4 text-violet-500" />
          Activity Feed
        </div>
        <ActivityFilter value={filter} onChange={setFilter} />
      </div>
      <ScrollArea style={{ maxHeight }}>
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : !activities?.length ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No activity yet</p>
        ) : (
          <div className="space-y-1 divide-y">
            {activities.map((log) => (
              <ActivityItem key={log._id} activity={log} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
