'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/utils';
import { Archive, ArchiveRestore, Layout, ArrowRight } from 'lucide-react';
import type { Board } from '@/types/models';
import { motion } from 'framer-motion';

interface BoardCardProps {
  board: Board;
  workspaceId: string;
  href: string;
  canArchive?: boolean;
  onArchive?: () => void;
  onUnarchive?: () => void;
}

export function BoardCard({ board, href, canArchive, onArchive, onUnarchive }: BoardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg h-full">
        <div className="absolute inset-x-0 top-0 h-1 gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                <Layout className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold line-clamp-1">{board.title}</CardTitle>
            </div>
            {board.isArchived && (
              <Badge variant="secondary" className="text-xs flex-shrink-0">Archived</Badge>
            )}
          </div>
          {board.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{board.description}</p>
          )}
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(board.createdAt)}
            </span>
            <div className="flex items-center gap-1">
              {canArchive && (
                board.isArchived ? (
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.preventDefault(); onUnarchive?.(); }}>
                    <ArchiveRestore className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.preventDefault(); onArchive?.(); }}>
                    <Archive className="h-3.5 w-3.5" />
                  </Button>
                )
              )}
              <Link href={href}>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
