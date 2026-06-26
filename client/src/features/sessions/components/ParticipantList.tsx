'use client';

import { UserAvatar } from '@/components/shared/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Users } from 'lucide-react';
import type { SessionParticipant } from '@/types/session.types';

interface ParticipantListProps {
  participants: SessionParticipant[];
  maxVisible?: number;
}

export function ParticipantList({ participants, maxVisible = 8 }: ParticipantListProps) {
  const active = participants.filter((p) => p.isActive);
  const inactive = participants.filter((p) => !p.isActive);
  const visible = active.slice(0, maxVisible);
  const remaining = active.length - maxVisible;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{active.length} online</span>
        {inactive.length > 0 && (
          <span className="text-xs text-muted-foreground">· {inactive.length} away</span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <div className="flex -space-x-2">
          {visible.map((p) => (
            <Tooltip key={p.user._id}>
              <TooltipTrigger asChild>
                <div>
                  <UserAvatar
                    name={p.user.name}
                    avatar={p.user.avatar}
                    size="sm"
                    className="ring-2 ring-background"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{p.user.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        {remaining > 0 && (
          <Badge variant="secondary" className="ml-1 text-xs">+{remaining}</Badge>
        )}
      </div>

      {inactive.length > 0 && (
        <ScrollArea className="max-h-[120px]">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Previously joined</p>
            {inactive.map((p) => (
              <div key={p.user._id} className="flex items-center gap-2 opacity-60">
                <UserAvatar name={p.user.name} avatar={p.user.avatar} size="sm" />
                <span className="text-xs text-muted-foreground">{p.user.name}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
