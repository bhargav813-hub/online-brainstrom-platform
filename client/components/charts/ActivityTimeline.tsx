'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { formatRelativeTime } from '@/lib/utils';
import {
  Lightbulb, ThumbsUp, ThumbsDown, UserPlus, UserMinus,
  Play, Pause, Square, Layers, Archive, ArrowRight,
  PenLine, Trash2, Move, RotateCcw, Activity,
} from 'lucide-react';
import type { ActivityAction } from '@/types/common';
import type { ActivityLog } from '@/types/models';
import { motion } from 'framer-motion';

const actionIcons: Record<ActivityAction, { icon: typeof Lightbulb; color: string }> = {
  idea_created: { icon: Lightbulb, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  idea_updated: { icon: PenLine, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  idea_deleted: { icon: Trash2, color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  idea_moved: { icon: Move, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  idea_restored: { icon: RotateCcw, color: 'bg-violet-500/10 text-violet-500 border-violet-500/20' },
  vote_cast: { icon: ThumbsUp, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  vote_removed: { icon: ThumbsDown, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  session_started: { icon: Play, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  session_paused: { icon: Pause, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  session_ended: { icon: Square, color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  user_joined: { icon: UserPlus, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  user_left: { icon: UserMinus, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  cluster_created: { icon: Layers, color: 'bg-violet-500/10 text-violet-500 border-violet-500/20' },
  cluster_updated: { icon: PenLine, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  cluster_deleted: { icon: Trash2, color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  board_created: { icon: ArrowRight, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  board_archived: { icon: Archive, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
};

const actionLabels: Record<ActivityAction, string> = {
  idea_created: 'created an idea',
  idea_updated: 'edited an idea',
  idea_deleted: 'deleted an idea',
  idea_moved: 'moved an idea',
  idea_restored: 'restored an idea',
  vote_cast: 'voted on an idea',
  vote_removed: 'removed their vote',
  session_started: 'started the session',
  session_paused: 'paused the session',
  session_ended: 'ended the session',
  user_joined: 'joined the session',
  user_left: 'left the session',
  cluster_created: 'created a cluster',
  cluster_updated: 'updated a cluster',
  cluster_deleted: 'deleted a cluster',
  board_created: 'created a board',
  board_archived: 'archived a board',
};

interface ActivityTimelineProps {
  logs: ActivityLog[];
  maxHeight?: string;
}

export function ActivityTimeline({ logs, maxHeight = '500px' }: ActivityTimelineProps) {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-4 w-4 text-primary" />
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea style={{ maxHeight }}>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No activity recorded</p>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border/50" />

              <div className="space-y-0">
                {logs.map((log, i) => {
                  const config = actionIcons[log.action] || {
                    icon: Activity,
                    color: 'bg-muted text-muted-foreground',
                  };
                  const Icon = config.icon;
                  const label = actionLabels[log.action] || log.action;

                  return (
                    <motion.div
                      key={log._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.5) }}
                      className="flex gap-3 py-2.5 px-1 relative"
                    >
                      {/* Icon node */}
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full border flex-shrink-0 z-10 ${config.color}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <UserAvatar name={log.user.name} avatar={log.user.avatar} size="sm" />
                          <p className="text-sm">
                            <span className="font-medium">{log.user.name}</span>{' '}
                            <span className="text-muted-foreground">{label}</span>
                          </p>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 ml-7">
                          {formatRelativeTime(log.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
