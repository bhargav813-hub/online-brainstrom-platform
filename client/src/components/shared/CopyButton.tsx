'use client';

import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const { copy, hasCopied } = useCopyToClipboard();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => copy(text)}
      aria-label="Copy to clipboard"
    >
      {hasCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}
