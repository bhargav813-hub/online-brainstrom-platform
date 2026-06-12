'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IdeaCard } from './IdeaCard';
import { useIdeaSearch } from '@/features/ideas/hooks/useIdeas';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface IdeaSearchBarProps {
  sessionId: string;
}

export function IdeaSearchBar({ sessionId }: IdeaSearchBarProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const { data, isPending } = useIdeaSearch(sessionId, debouncedQuery);

  return (
    <Popover open={open && query.length >= 2} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search ideas..."
            className="pl-8 h-8 text-xs"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => query.length >= 2 && setOpen(true)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <ScrollArea className="max-h-64">
          <div className="p-2">
            {isPending ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : !data?.data || data.data.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                No ideas found for &ldquo;{debouncedQuery}&rdquo;
              </p>
            ) : (
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground px-2 pb-1">
                  {data.pagination.total} result{data.pagination.total !== 1 ? 's' : ''}
                </p>
                {data.data.map((idea) => (
                  <IdeaCard key={idea._id} idea={idea} compact />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
