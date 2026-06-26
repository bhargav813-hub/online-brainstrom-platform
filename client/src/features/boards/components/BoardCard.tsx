'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Archive, ArchiveRestore, Share2, Trash2, MoreVertical, FileText, ArrowRight } from 'lucide-react';
import { formatRelativeTime } from '@/lib/formatters';
import { ROUTES } from '@/constants/routes';
import { useArchiveBoard, useUnarchiveBoard, useDeleteBoard } from '../hooks/useBoard';
import { usePermissions } from '@/hooks/usePermissions';
import type { Board } from '@/types/board.types';
import type { UserRole } from '@/constants/roles';

interface BoardCardProps {
  board: Board;
  workspaceId: string;
  userRole?: UserRole | null;
  index: number;
}

export function BoardCard({ board, workspaceId, userRole, index }: BoardCardProps) {
  const { canArchiveBoard, canDeleteBoard } = usePermissions(userRole);
  const archive = useArchiveBoard(workspaceId);
  const unarchive = useUnarchiveBoard(workspaceId);
  const deleteBoard = useDeleteBoard(workspaceId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-muted/50 ${board.isArchived ? 'opacity-60' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <Link href={ROUTES.BOARD(workspaceId, board._id)} className="flex-1">
              <CardTitle className="flex items-center gap-2 text-lg hover:text-violet-600 transition-colors">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="truncate">{board.name}</span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
            </Link>
            {(canArchiveBoard || canDeleteBoard) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canArchiveBoard && !board.isArchived && (
                    <DropdownMenuItem onClick={() => archive.mutate(board._id)}>
                      <Archive className="mr-2 h-4 w-4" /> Archive
                    </DropdownMenuItem>
                  )}
                  {canArchiveBoard && board.isArchived && (
                    <DropdownMenuItem onClick={() => unarchive.mutate(board._id)}>
                      <ArchiveRestore className="mr-2 h-4 w-4" /> Restore
                    </DropdownMenuItem>
                  )}
                  {canDeleteBoard && (
                    <DropdownMenuItem className="text-destructive" onClick={() => deleteBoard.mutate(board._id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {board.description && (
            <CardDescription className="line-clamp-2 mt-1">{board.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-xs text-muted-foreground pt-0">
          {board.isArchived && <Badge variant="secondary" className="text-xs">Archived</Badge>}
          {board.isPublic && (
            <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Share2 className="mr-1 h-3 w-3" />Shared
            </Badge>
          )}
          <span className="ml-auto">{formatRelativeTime(board.createdAt)}</span>
        </CardContent>
      </Card>
    </motion.div>
  );
}
