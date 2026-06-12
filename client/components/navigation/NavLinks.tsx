'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface NavLinkItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

interface NavLinksProps {
  items: NavLinkItem[];
  collapsed?: boolean;
  className?: string;
}

export function NavLinks({ items, collapsed = false, className }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex flex-col gap-1', className)}>
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm glow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-4 w-4 flex-shrink-0', isActive && 'text-primary')} />
              {!collapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}
              {!collapsed && item.badge !== undefined && (
                <span className="ml-auto text-[10px] font-semibold rounded-full bg-primary/10 text-primary px-2 py-0.5">
                  {item.badge}
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
