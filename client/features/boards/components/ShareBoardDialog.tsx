'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToggleGuestAccess } from '../hooks/useBoards';
import { Globe, Lock, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { Board } from '@/types/models';

interface ShareBoardDialogProps {
  board: Board;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareBoardDialog({ board, open, onOpenChange }: ShareBoardDialogProps) {
  const toggleGuestAccess = useToggleGuestAccess();
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const shareUrl = board.shareToken ? `${origin}/shared/${board.shareToken}` : '';

  const handleToggle = (checked: boolean) => {
    toggleGuestAccess.mutate({ boardId: board._id, enabled: checked });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md glass-strong">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Share Board
          </DialogTitle>
          <DialogDescription>
            Configure guest access to share a view-only link for non-registered users.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg bg-card/20">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold flex items-center gap-1.5">
                {board.guestAccessEnabled ? (
                  <>
                    <Globe className="h-3.5 w-3.5 text-emerald-500" />
                    Guest Access Enabled
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    Private Board
                  </>
                )}
              </Label>
              <p className="text-xs text-muted-foreground">
                Anyone with the link can view (but not edit) this board.
              </p>
            </div>
            <Switch
              checked={board.guestAccessEnabled || false}
              onCheckedChange={handleToggle}
              disabled={toggleGuestAccess.isPending}
            />
          </div>

          {board.guestAccessEnabled && shareUrl && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Shareable View-Only Link</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={shareUrl}
                  className="text-xs h-9 bg-card/50 border-border/50 focus-visible:ring-0"
                />
                <Button variant="outline" size="icon" className="h-9 w-9 flex-shrink-0" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
