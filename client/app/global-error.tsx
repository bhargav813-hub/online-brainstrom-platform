'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-background font-sans">
        <div className="text-center space-y-6 px-4">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Critical Error</h2>
            <p className="text-gray-500 mt-2">
              The application encountered a critical error. Please refresh the page.
            </p>
          </div>
          <Button onClick={reset} className="gap-1.5">
            <RotateCcw className="h-4 w-4" /> Reload
          </Button>
        </div>
      </body>
    </html>
  );
}
