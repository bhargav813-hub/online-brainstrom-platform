import { Badge } from '@/components/ui/badge';
import type { SessionStatus } from '@/types/common';
import { cn } from '@/lib/utils';
import { Play, Pause, CheckCircle } from 'lucide-react';

const statusConfig: Record<SessionStatus, { label: string; icon: React.ReactNode; className: string }> = {
  active: {
    label: 'Active',
    icon: <Play className="h-3 w-3" />,
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  paused: {
    label: 'Paused',
    icon: <Pause className="h-3 w-3" />,
    className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  ended: {
    label: 'Ended',
    icon: <CheckCircle className="h-3 w-3" />,
    className: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  },
};

interface StatusBadgeProps {
  status: SessionStatus;
  className?: string;
}

const fallbackConfig = {
  label: 'Unknown',
  icon: null,
  className: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? fallbackConfig;
  return (
    <Badge
      variant="outline"
      className={cn('gap-1 font-medium text-xs', config.className, className)}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}
