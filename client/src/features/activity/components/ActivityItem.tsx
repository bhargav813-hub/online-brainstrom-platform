'use client';

import { UserAvatar } from '@/components/shared/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/formatters';
import { Clock, Lightbulb, ThumbsUp, Layers, Users, Play } from 'lucide-react';
import type { ActivityLog, ActivityAction } from '@/types/activity.types';

const actionConfig: Record<ActivityAction, { label: string; icon: React.ElementType; color: string }> = {
  idea_created: { label: 'added an idea', icon: Lightbulb, color: 'text-amber-500' },
  idea_updated: { label: 'updated an idea', icon: Lightbulb, color: 'text-blue-500' },
  idea_deleted: { label: 'deleted an idea', icon: Lightbulb, color: 'text-rose-500' },
  idea_moved: { label: 'moved an idea', icon: Lightbulb, color: 'text-indigo-500' },
  vote_cast: { label: 'voted', icon: ThumbsUp, color: 'text-violet-500' },
  vote_removed: { label: 'removed a vote', icon: ThumbsUp, color: 'text-slate-500' },
  cluster_created: { label: 'created a cluster', icon: Layers, color: 'text-emerald-500' },
  cluster_updated: { label: 'updated a cluster', icon: Layers, color: 'text-teal-500' },
  cluster_deleted: { label: 'deleted a cluster', icon: Layers, color: 'text-rose-500' },
  session_started: { label: 'started the session', icon: Play, color: 'text-emerald-500' },
  session_paused: { label: 'paused the session', icon: Play, color: 'text-amber-500' },
  session_ended: { label: 'ended the session', icon: Play, color: 'text-slate-500' },
  participant_joined: { label: 'joined', icon: Users, color: 'text-blue-500' },
  participant_left: { label: 'left', icon: Users, color: 'text-slate-400' },
};

interface ActivityItemProps {
  activity: ActivityLog;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const config = actionConfig[activity.action] || { label: activity.action, icon: Clock, color: 'text-muted-foreground' };
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 py-2">
      <div className="relative shrink-0">
        <UserAvatar name={activity.user?.name || 'User'} avatar={activity.user?.avatar} size="sm" />
        <div className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-background ring-1 ring-border ${config.color}`}>
          <Icon className="h-2.5 w-2.5" />
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-sm">
          <span className="font-medium">{activity.user?.name || 'Unknown'}</span>{' '}
          <span className="text-muted-foreground">{config.label}</span>
        </p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatRelativeTime(activity.createdAt)}
        </p>
      </div>
    </div>
  );
}
