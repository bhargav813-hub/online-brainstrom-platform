import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { type LucideIcon, Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode | {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const renderAction = () => {
    if (!action) return null;
    if (typeof action === 'object' && 'label' in action && 'onClick' in action) {
      return (
        <Button onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      );
    }
    return <div className="mt-2">{action}</div>;
  };

  return (
    <div className={cn('flex min-h-[300px] items-center justify-center', className)}>
      <div className="text-center space-y-4 max-w-sm mx-auto p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 border border-border/50">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {renderAction()}
      </div>
    </div>
  );
}

