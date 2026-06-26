'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export function useCopyToClipboard() {
  const [hasCopied, setHasCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        // Avoid scrolling to bottom
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setHasCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  }, []);

  return { copy, hasCopied };
}
