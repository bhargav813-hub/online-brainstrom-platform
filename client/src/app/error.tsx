'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        An unexpected error occurred. Please try again or return to the homepage.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset} variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Try again
        </Button>
        <Link href="/">
          <Button className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600">
            <Home className="h-4 w-4" />
            Go home
          </Button>
        </Link>
      </div>
    </div>
  );
}
