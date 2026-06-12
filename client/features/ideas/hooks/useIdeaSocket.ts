'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/lib/socket';
import { useSocketStore } from '@/store/socket.store';
import { queryKeys } from '@/lib/queryKeys';
import type { Idea } from '@/types/models';
import type {
  IdeaCreatedEvent,
  IdeaUpdatedEvent,
  IdeaDeletedEvent,
  IdeaMovedEvent,
  VoteCastEvent,
  VoteRemovedEvent,
} from '@/types/socket';

/**
 * Subscribes to Socket.IO events for the active session.
 * Patches TanStack Query cache directly to avoid network refetch.
 */
export function useIdeaSocket(sessionId: string) {
  const queryClient = useQueryClient();
  const { isConnected } = useSocketStore();

  useEffect(() => {
    if (!isConnected || !sessionId) return;

    const socket = getSocket();
    if (!socket) return;

    // Join session room
    socket.emit('session:join', { sessionId });

    const handleIdeaCreated = (event: IdeaCreatedEvent) => {
      if (event.sessionId !== sessionId) return;
      queryClient.setQueryData<Idea[]>(
        queryKeys.ideas.hierarchy(sessionId),
        (old) => (old ? [...old, event.idea] : [event.idea])
      );
    };

    const handleIdeaUpdated = (event: IdeaUpdatedEvent) => {
      if (event.sessionId !== sessionId) return;
      queryClient.setQueryData<Idea[]>(
        queryKeys.ideas.hierarchy(sessionId),
        (old) =>
          old?.map((idea) =>
            idea._id === event.idea._id ? event.idea : idea
          ) ?? []
      );
    };

    const handleIdeaDeleted = (event: IdeaDeletedEvent) => {
      if (event.sessionId !== sessionId) return;
      queryClient.setQueryData<Idea[]>(
        queryKeys.ideas.hierarchy(sessionId),
        (old) =>
          old?.map((idea) =>
            idea._id === event.ideaId ? { ...idea, isDeleted: true } : idea
          ) ?? []
      );
    };

    const handleIdeaMoved = (event: IdeaMovedEvent) => {
      if (event.sessionId !== sessionId) return;
      // Full refetch is safer for tree moves since paths change
      queryClient.invalidateQueries({ queryKey: queryKeys.ideas.hierarchy(sessionId) });
    };

    const handleVoteCast = (event: VoteCastEvent) => {
      if (event.sessionId !== sessionId) return;
      queryClient.setQueryData<Idea[]>(
        queryKeys.ideas.hierarchy(sessionId),
        (old) =>
          old?.map((idea) =>
            idea._id === event.ideaId
              ? { ...idea, upvoteCount: event.upvoteCount, downvoteCount: event.downvoteCount }
              : idea
          ) ?? []
      );
    };

    const handleVoteRemoved = (event: VoteRemovedEvent) => {
      if (event.sessionId !== sessionId) return;
      queryClient.setQueryData<Idea[]>(
        queryKeys.ideas.hierarchy(sessionId),
        (old) =>
          old?.map((idea) =>
            idea._id === event.ideaId
              ? { ...idea, upvoteCount: event.upvoteCount, downvoteCount: event.downvoteCount }
              : idea
          ) ?? []
      );
    };

    socket.on('idea:created', handleIdeaCreated);
    socket.on('idea:updated', handleIdeaUpdated);
    socket.on('idea:deleted', handleIdeaDeleted);
    socket.on('idea:moved', handleIdeaMoved);
    socket.on('vote:cast', handleVoteCast);
    socket.on('vote:removed', handleVoteRemoved);

    return () => {
      socket.off('idea:created', handleIdeaCreated);
      socket.off('idea:updated', handleIdeaUpdated);
      socket.off('idea:deleted', handleIdeaDeleted);
      socket.off('idea:moved', handleIdeaMoved);
      socket.off('vote:cast', handleVoteCast);
      socket.off('vote:removed', handleVoteRemoved);
      socket.emit('session:leave', { sessionId });
    };
  }, [sessionId, isConnected, queryClient]);
}
