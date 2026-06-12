'use client';

import { useActivity } from '@/features/activity/hooks/useActivity';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatRelativeTime } from '@/lib/utils';
import {
  Lightbulb, ThumbsUp, ThumbsDown, UserPlus, UserMinus,
  Play, Pause, Square, Layers, Archive, ArrowRight,
  PenLine, Trash2, Move, RotateCcw, Activity,
} from 'lucide-react';
import type { ActivityAction } from '@/types/common';
import type { ActivityLog } from '@/types/models';
import { motion } from 'framer-motion';

const actionConfig: Record<ActivityAction, { icon: typeof Lightbulb; color: string; label: string }> = {
  idea_created: { icon: Lightbulb, color: 'text-emerald-500', label: 'created an idea' },
  idea_updated: { icon: PenLine, color: 'text-blue-500', label: 'updated an idea' },
  idea_deleted: { icon: Trash2, color: 'text-red-400', label: 'deleted an idea' },
  idea_moved: { icon: Move, color: 'text-amber-500', label: 'moved an idea' },
  idea_restored: { icon: RotateCcw, color: 'text-violet-500', label: 'restored an idea' },
  vote_cast: { icon: ThumbsUp, color: 'text-emerald-500', label: 'cast a vote' },
  vote_removed: { icon: ThumbsDown, color: 'text-muted-foreground', label: 'removed a vote' },
  session_started: { icon: Play, color: 'text-emerald-500', label: 'started the session' },
  session_paused: { icon: Pause, color: 'text-amber-500', label: 'paused the session' },
  session_ended: { icon: Square, color: 'text-red-400', label: 'ended the session' },
  user_joined: { icon: UserPlus, color: 'text-emerald-500', label: 'joined the session' },
  user_left: { icon: UserMinus, color: 'text-muted-foreground', label: 'left the session' },
  cluster_created: { icon: Layers, color: 'text-violet-500', label: 'created a cluster' },
  cluster_updated: { icon: PenLine, color: 'text-blue-500', label: 'updated a cluster' },
  cluster_deleted: { icon: Trash2, color: 'text-red-400', label: 'deleted a cluster' },
  board_created: { icon: ArrowRight, color: 'text-blue-500', label: 'created a board' },
  board_archived: { icon: Archive, color: 'text-amber-500', label: 'archived a board' },
};

function ActivityItem({ log }: { log: ActivityLog }) {
  const config = actionConfig[log.action] || {
    icon: Activity,
    color: 'text-muted-foreground',
    label: log.action,
  };
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-3 py-2.5 px-2 rounded-lg hover:bg-accent/30 transition-colors"
    >
      <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-accent flex-shrink-0 ${config.color}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-medium">{log.user.name}</span>{' '}
          <span className="text-muted-foreground">{config.label}</span>
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {formatRelativeTime(log.createdAt)}
        </p>
      </div>
    </motion.div>
  );
}

interface ActivityFeedProps {
  sessionId: string;
  limit?: number;
  shareToken?: string;
}

export function ActivityFeed({ sessionId, limit = 20, shareToken }: ActivityFeedProps) {
  const { data, isPending } = useActivity(sessionId, 1, limit, shareToken);

  if (isPending) {
    return <LoadingSkeleton variant="list" count={5} />;
  }

  const logs = data?.data ?? [];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Activity className="h-4 w-4 text-muted-foreground" />
        <span>Activity</span>
        {data?.pagination && (
          <Badge variant="secondary" className="text-[10px]">
            {data.pagination.total}
          </Badge>
        )}
      </div>

      <ScrollArea className="max-h-[500px]">
        {logs.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No activity yet"
            description="Activity will appear here as participants interact."
          />
        ) : (
          <div className="space-y-0.5">
            {logs.map((log) => (
              <ActivityItem key={log._id} log={log} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
