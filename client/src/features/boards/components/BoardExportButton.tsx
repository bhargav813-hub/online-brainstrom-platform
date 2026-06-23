'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useExportBoard } from '@/features/boards/hooks/useBoard';
import { Download, FileJson, FileText, Loader2 } from 'lucide-react';
import type { ExportFormat } from '@/types/board.types';

interface BoardExportButtonProps {
  boardId: string;
}

export function BoardExportButton({ boardId }: BoardExportButtonProps) {
  const exportBoard = useExportBoard();

  const handleExport = (format: ExportFormat) => {
    exportBoard.mutate({ boardId, format });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={exportBoard.isPending}>
          {exportBoard.isPending ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-1.5 h-4 w-4" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          <FileJson className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
