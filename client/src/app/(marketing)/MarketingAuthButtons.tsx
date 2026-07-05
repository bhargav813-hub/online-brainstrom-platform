'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export function MarketingAuthButtons() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <div className="h-9 w-20 animate-pulse rounded-lg bg-muted"></div>;
  }

  if (isAuthenticated) {
    return (
      <Link
        href="/workspaces"
        className="inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl"
      >
        Go to Workspaces
        <ArrowRight className="ml-1.5 h-4 w-4" />
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Sign in
      </Link>
      <Link
        href="/register"
        className="inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl"
      >
        Get Started
        <ArrowRight className="ml-1.5 h-4 w-4" />
      </Link>
    </>
  );
}
