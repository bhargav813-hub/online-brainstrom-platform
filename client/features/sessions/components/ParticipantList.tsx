'use client';

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getSocket } from '@/lib/socket';
import { useSocketStore } from '@/store/socket.store';
import { queryKeys } from '@/lib/queryKeys';
import { formatRelativeTime } from '@/lib/utils';
import { Users, Wifi, WifiOff, UserPlus } from 'lucide-react';
import type { SessionParticipant } from '@/types/models';
import type { ParticipantJoinedEvent, ParticipantLeftEvent } from '@/types/socket';
import { motion, AnimatePresence } from 'framer-motion';
import { InviteToSessionDialog } from './InviteToSessionDialog';

interface ParticipantListProps {
  sessionId: string;
  participants: SessionParticipant[];
  canManage?: boolean;
}

export function ParticipantList({ sessionId, participants, canManage }: ParticipantListProps) {
  const { isConnected } = useSocketStore();
  const queryClient = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);

  useEffect(() => {
    if (!isConnected || !sessionId) return;
    const socket = getSocket();
    if (!socket) return;

    const handleJoined = (event: ParticipantJoinedEvent) => {
      if (event.sessionId !== sessionId) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.detail(sessionId) });
    };

    const handleLeft = (event: ParticipantLeftEvent) => {
      if (event.sessionId !== sessionId) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.detail(sessionId) });
    };

    socket.on('participant:joined', handleJoined);
    socket.on('participant:left', handleLeft);

    return () => {
      socket.off('participant:joined', handleJoined);
      socket.off('participant:left', handleLeft);
    };
  }, [sessionId, isConnected, queryClient]);

  const activeParticipants = participants.filter((p) => p.isActive);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>Participants</span>
          <Badge variant="secondary" className="text-xs h-5 px-1.5">
            {activeParticipants.length}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {isConnected ? (
              <><Wifi className="h-3 w-3 text-emerald-500" /><span className="text-emerald-500">Live</span></>
            ) : (
              <><WifiOff className="h-3 w-3 text-destructive" /><span className="text-destructive">Offline</span></>
            )}
          </div>
          {canManage && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => setInviteOpen(true)}
              title="Add member to session"
            >
              <UserPlus className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="max-h-64">
        <AnimatePresence mode="popLayout">
          <div className="space-y-1">
            {activeParticipants.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                No active participants yet.
                {canManage && (
                  <button
                    onClick={() => setInviteOpen(true)}
                    className="block mx-auto mt-1 text-primary hover:underline"
                  >
                    + Invite someone
                  </button>
                )}
              </p>
            )}
            {activeParticipants.map((p) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent/50 transition-colors"
              >
                <div className="relative">
                  <UserAvatar name={p.user.name} avatar={p.user.avatar} size="sm" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.user.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    Joined {formatRelativeTime(p.joinedAt)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </ScrollArea>

      <InviteToSessionDialog
        sessionId={sessionId}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />
    </div>
  );
}
