'use client';

import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/utils';
import { Archive, ArchiveRestore, ArrowRight, Layout } from 'lucide-react';
import type { Board } from '@/types/models';

interface BoardsTableProps {
  boards: Board[];
  workspaceId: string;
  getHref: (boardId: string) => string;
  canArchive?: boolean;
  onArchive?: (boardId: string) => void;
  onUnarchive?: (boardId: string) => void;
}

export function BoardsTable({
  boards,
  canArchive = false,
  getHref,
  onArchive,
  onUnarchive,
}: BoardsTableProps) {
  if (boards.length === 0) return null;

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-[300px]">Board</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {boards.map((board) => (
            <TableRow key={board._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                    <Layout className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{board.title}</p>
                    {board.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{board.description}</p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {board.isArchived ? (
                  <Badge variant="secondary" className="text-xs">Archived</Badge>
                ) : (
                  <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-500">Active</Badge>
                )}
              </TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(board.createdAt)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {canArchive && (
                    board.isArchived ? (
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onUnarchive?.(board._id)}>
                        <ArchiveRestore className="h-3.5 w-3.5" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onArchive?.(board._id)}>
                        <Archive className="h-3.5 w-3.5" />
                      </Button>
                    )
                  )}
                  <Link href={getHref(board._id)}>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
