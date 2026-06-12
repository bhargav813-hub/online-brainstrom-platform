'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  action?: ReactNode;
}

export function PageContainer({ children, className, title, description, actions, action }: PageContainerProps) {
  const actionContent = actions || action;
  return (
    <div className={cn('flex-1 overflow-auto', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {(title || actionContent) && (
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {title && (
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-heading">{title}</h1>
              )}
              {description && (
                <p className="mt-1.5 text-muted-foreground text-sm sm:text-base">{description}</p>
              )}
            </div>
            {actionContent && <div className="flex items-center gap-3 flex-wrap">{actionContent}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
