'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import type { Idea } from '@/types/idea.types';
import { useDebounce } from '@/hooks/useDebounce';

export interface IdeaFilterState {
  search: string;
  sortBy: 'none' | 'highest_voted' | 'lowest_voted' | 'newest';
  tag: string;
  authorId: string;
}

interface IdeaFilterBarProps {
  ideas: Idea[];
  onFilterChange: (filters: IdeaFilterState) => void;
}

export function IdeaFilterBar({ ideas, onFilterChange }: IdeaFilterBarProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<IdeaFilterState['sortBy']>('none');
  const [tag, setTag] = useState('all');
  const [authorId, setAuthorId] = useState('all');
  
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    onFilterChange({
      search: debouncedSearch,
      sortBy,
      tag: tag === 'all' ? '' : tag,
      authorId: authorId === 'all' ? '' : authorId,
    });
  }, [debouncedSearch, sortBy, tag, authorId, onFilterChange]);

  // Extract unique tags and authors from the idea hierarchy
  const uniqueTags = new Set<string>();
  const uniqueAuthors = new Map<string, { id: string; name: string }>();

  const extractMetadata = (ideaList: Idea[]) => {
    ideaList.forEach((idea) => {
      idea.tags?.forEach((t) => uniqueTags.add(t));
      if (idea.author && typeof idea.author === 'object') {
        uniqueAuthors.set(idea.author._id, { id: idea.author._id, name: idea.author.name });
      }
      if (idea.children && idea.children.length > 0) {
        extractMetadata(idea.children);
      }
    });
  };

  extractMetadata(ideas);

  const tags = Array.from(uniqueTags);
  const authors = Array.from(uniqueAuthors.values());

  const hasActiveFilters = search !== '' || sortBy !== 'none' || tag !== 'all' || authorId !== 'all';

  const clearFilters = () => {
    setSearch('');
    setSortBy('none');
    setTag('all');
    setAuthorId('all');
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-card p-3 rounded-xl border border-border shadow-sm">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search ideas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-background w-full"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        <Select value={sortBy} onValueChange={(v) => setSortBy((v as IdeaFilterState['sortBy']) || 'none')}>
          <SelectTrigger className="w-[140px] bg-background">
            <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Default</SelectItem>
            <SelectItem value="highest_voted">Highest Voted</SelectItem>
            <SelectItem value="lowest_voted">Lowest Voted</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>

        {tags.length > 0 && (
          <Select value={tag} onValueChange={(v) => setTag(v || 'all')}>
            <SelectTrigger className="w-[120px] bg-background">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {tags.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {authors.length > 0 && (
          <Select value={authorId} onValueChange={(v) => setAuthorId(v || 'all')}>
            <SelectTrigger className="w-[130px] bg-background">
              <SelectValue placeholder="All Members" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              {authors.map((a) => {
                const val = typeof a.id === 'string' ? a.id : String(a.id);
                return (
                  <SelectItem key={val} value={val}>
                    {a.name || 'Unknown Member'}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}

        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters} className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
