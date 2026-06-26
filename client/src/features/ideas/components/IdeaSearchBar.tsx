'use client';

import { useState } from 'react';
import { useIdeaSearch } from '@/features/ideas/hooks/useIdeas';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IdeaCard } from './IdeaCard';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IdeaSearchBarProps {
  sessionId: string;
}

export function IdeaSearchBar({ sessionId }: IdeaSearchBarProps) {
  const [query, setQuery] = useState('');
  const { data: results, isLoading } = useIdeaSearch(sessionId, query);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ideas..."
          className="pl-9 pr-9"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            onClick={() => setQuery('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {query.length >= 2 && (
        <div className="absolute top-full z-20 mt-1 w-full rounded-lg border bg-popover shadow-xl">
          <ScrollArea className="max-h-[300px]">
            <div className="p-2 space-y-2">
              {isLoading ? (
                <p className="py-4 text-center text-sm text-muted-foreground">Searching...</p>
              ) : !results?.length ? (
                <p className="py-4 text-center text-sm text-muted-foreground">No ideas found</p>
              ) : (
                results.map((idea) => (
                  <IdeaCard key={idea._id} idea={idea} sessionId={sessionId} />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
