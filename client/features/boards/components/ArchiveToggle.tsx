'use client';

import { Button } from '@/components/ui/button';
import { Archive, ArchiveRestore, Loader2 } from 'lucide-react';

interface ArchiveToggleProps {
  isArchived: boolean;
  onArchive: () => void;
  onUnarchive: () => void;
  isLoading?: boolean;
  size?: 'default' | 'sm' | 'icon';
}

export function ArchiveToggle({
  isArchived,
  onArchive,
  onUnarchive,
  isLoading = false,
  size = 'icon',
}: ArchiveToggleProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isArchived) {
      onUnarchive();
    } else {
      onArchive();
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
      onClick={handleClick}
      disabled={isLoading}
      aria-label={isArchived ? 'Unarchive' : 'Archive'}
      title={isArchived ? 'Unarchive board' : 'Archive board'}
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isArchived ? (
        <ArchiveRestore className="h-3.5 w-3.5" />
      ) : (
        <Archive className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}
