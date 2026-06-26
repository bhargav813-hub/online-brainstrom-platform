'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment, useMemo } from 'react';

export function Breadcrumbs() {
  const pathname = usePathname();

  const segments = useMemo(() => {
    const parts = pathname.split('/').filter(Boolean);
    const crumbs: { label: string; href: string }[] = [];

    let path = '';
    for (const part of parts) {
      path += `/${part}`;
      // Skip route group segments
      if (part.startsWith('(') && part.endsWith(')')) continue;
      // Make labels human-readable
      const label = part
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      crumbs.push({ label, href: path });
    }

    return crumbs;
  }, [pathname]);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-sm">
      <Link
        href="/workspaces"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {segments.map((segment, i) => (
        <Fragment key={segment.href}>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          {i === segments.length - 1 ? (
            <span className="font-medium text-foreground truncate max-w-[200px]">
              {segment.label}
            </span>
          ) : (
            <Link
              href={segment.href}
              className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[150px]"
            >
              {segment.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
