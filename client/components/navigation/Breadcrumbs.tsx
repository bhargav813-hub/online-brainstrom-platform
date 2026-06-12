'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment, useMemo } from 'react';
import { cn } from '@/lib/utils';

export function Breadcrumbs() {
  const pathname = usePathname();

  const crumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const items: Array<{ label: string; href: string; isLast: boolean }> = [];

    let currentPath = '';
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentPath += `/${segment}`;

      // Skip dynamic IDs, use previous label context
      const isId = /^[a-f0-9]{24}$/.test(segment);
      const label = isId
        ? '...'
        : segment
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());

      items.push({
        label,
        href: currentPath,
        isLast: i === segments.length - 1,
      });
    }

    return items;
  }, [pathname]);

  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
      <Link
        href="/workspaces"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {crumbs.map((crumb, i) => (
        <Fragment key={crumb.href}>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          {crumb.isLast ? (
            <span className="font-medium text-foreground truncate max-w-[200px]">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="hover:text-foreground transition-colors truncate max-w-[150px]"
            >
              {crumb.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
