'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold font-heading">Something went wrong</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
        </div>
        <Button onClick={reset} className="gap-1.5">
          <RotateCcw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    </div>
  );
}
