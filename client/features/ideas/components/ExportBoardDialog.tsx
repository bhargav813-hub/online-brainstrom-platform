'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useExportTree } from '../hooks/useExportTree';
import { FileText, Image, FileCode, Download, Loader2 } from 'lucide-react';

interface ExportBoardDialogProps {
  sessionId: string;
  sessionTitle: string;
  shareToken?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportBoardDialog({
  sessionId,
  sessionTitle,
  shareToken,
  open,
  onOpenChange,
}: ExportBoardDialogProps) {
  const { isExporting, exportMarkdown, exportPNG, exportPDF } = useExportTree({
    sessionId,
    sessionTitle,
    shareToken,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md glass-strong">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export Brainstorming Session
          </DialogTitle>
          <DialogDescription>
            Choose a format to save the brainstorming results. The visual formats (PDF/PNG) will capture the current expansion state of the tree.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 pt-4">
          {/* PDF Option */}
          <Button
            variant="outline"
            className="flex items-center justify-start gap-4 p-6 h-auto text-left border-border/50 bg-card/20 hover:bg-accent/40"
            onClick={() => exportPDF()}
            disabled={isExporting}
          >
            <div className="p-2.5 rounded-lg bg-red-500/10 text-red-500 flex-shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Export as PDF Document</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Save a multi-page PDF document containing the visual tree.
              </p>
            </div>
          </Button>

          {/* PNG Option */}
          <Button
            variant="outline"
            className="flex items-center justify-start gap-4 p-6 h-auto text-left border-border/50 bg-card/20 hover:bg-accent/40"
            onClick={() => exportPNG()}
            disabled={isExporting}
          >
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500 flex-shrink-0">
              <Image className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Export as PNG Image</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Save a high-resolution image of the visual idea tree.
              </p>
            </div>
          </Button>

          {/* Markdown Option */}
          <Button
            variant="outline"
            className="flex items-center justify-start gap-4 p-6 h-auto text-left border-border/50 bg-card/20 hover:bg-accent/40"
            onClick={() => exportMarkdown()}
            disabled={isExporting}
          >
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 flex-shrink-0">
              <FileCode className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Export as Markdown Outline</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Save a text-based hierarchical outline showing details and votes.
              </p>
            </div>
          </Button>
        </div>

        {isExporting && (
          <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground animate-pulse">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            Generating your export... please wait.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
