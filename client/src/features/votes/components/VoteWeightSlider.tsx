'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface VoteWeightSliderProps {
  value: number;
  onChange: (weight: number) => void;
  min?: number;
  max?: number;
}

export function VoteWeightSlider({ value, onChange, min = 1, max = 10 }: VoteWeightSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">Vote Weight</Label>
        <span className="text-sm font-bold text-violet-600">{value}</span>
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => onChange(w)}
            className={cn(
              'h-7 flex-1 rounded text-xs font-medium transition-all',
              w <= value
                ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-sm'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            )}
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  );
}
