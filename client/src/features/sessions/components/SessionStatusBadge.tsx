'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { SessionStatus } from '@/types/session.types';
import { Play, Pause, Square } from 'lucide-react';

const statusConfig: Record<SessionStatus, { label: string; className: string; icon: React.ElementType }> = {
  active: {
    label: 'Active',
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    icon: Play,
  },
  paused: {
    label: 'Paused',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    icon: Pause,
  },
  ended: {
    label: 'Ended',
    className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    icon: Square,
  },
};

interface SessionStatusBadgeProps {
  status: SessionStatus;
  className?: string;
}

export function SessionStatusBadge({ status, className }: SessionStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn('gap-1 font-medium', config.className, className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
