'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWorkspaces } from '@/features/workspaces/hooks/useWorkspace';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { ChevronRight, FolderKanban } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function WorkspaceNav() {
  const pathname = usePathname();
  const { data: workspaces } = useWorkspaces();

  if (!workspaces?.length) return null;

  return (
    <div className="space-y-1">
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Workspaces
      </p>
      <ScrollArea className="max-h-[200px]">
        <div className="space-y-0.5">
          {workspaces.map((ws) => {
            const href = ROUTES.WORKSPACE(ws._id);
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={ws._id}
                href={href}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-violet-500/10 text-violet-700 dark:text-violet-400 font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <FolderKanban className="h-4 w-4 shrink-0" />
                <span className="truncate">{ws.name}</span>
                {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 text-violet-500" />}
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
