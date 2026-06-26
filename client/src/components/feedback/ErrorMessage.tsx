'use client';

import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message?: string;
  className?: string;
  retry?: () => void;
}

export function ErrorMessage({
  message = 'Something went wrong',
  className,
  retry,
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center',
        className
      )}
    >
      <AlertCircle className="h-10 w-10 text-destructive" />
      <div>
        <p className="font-medium text-destructive">{message}</p>
      </div>
      {retry && (
        <button
          onClick={retry}
          className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
        >
          Try again
        </button>
      )}
    </div>
  );
}
