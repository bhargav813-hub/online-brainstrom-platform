'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ActivityAction } from '@/types/activity.types';

const ACTION_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Activity' },
  { value: 'idea_created', label: 'Ideas Created' },
  { value: 'idea_updated', label: 'Ideas Updated' },
  { value: 'idea_deleted', label: 'Ideas Deleted' },
  { value: 'vote_cast', label: 'Votes Cast' },
  { value: 'cluster_created', label: 'Clusters Created' },
  { value: 'session_started', label: 'Session Events' },
  { value: 'participant_joined', label: 'Participants' },
];

interface ActivityFilterProps {
  value: string;
  onChange: (action: string) => void;
}

export function ActivityFilter({ value, onChange }: ActivityFilterProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v || 'all')}>
      <SelectTrigger className="w-[180px] h-8 text-xs">
        <SelectValue placeholder="Filter activity" />
      </SelectTrigger>
      <SelectContent>
        {ACTION_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
