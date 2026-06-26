import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageContainer({
  children,
  className,
  title,
  description,
  action,
}: PageContainerProps) {
  return (
    <div className={cn('flex-1 space-y-6 p-4 sm:p-6 lg:p-8', className)}>
      {(title || action) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{title}</h1>}
            {description && (
              <p className="mt-1 text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
