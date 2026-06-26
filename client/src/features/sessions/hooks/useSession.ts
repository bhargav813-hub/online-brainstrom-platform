'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sessionService } from '@/services/session.service';
import { queryKeys } from '@/constants/query-keys';
import type { CreateSessionPayload, UpdateSessionPayload } from '@/types/session.types';

export function useSessions(boardId: string) {
  return useQuery({
    queryKey: queryKeys.sessions.byBoard(boardId),
    queryFn: () => sessionService.getByBoard(boardId),
    enabled: !!boardId,
    select: (data) => data.data,
  });
}

export function useSession(sessionId: string) {
  return useQuery({
    queryKey: queryKeys.sessions.detail(sessionId),
    queryFn: () => sessionService.getById(sessionId),
    enabled: !!sessionId,
  });
}

export function useCreateSession(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSessionPayload) => sessionService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.byBoard(boardId) });
      toast.success('Session created!');
    },
  });
}

export function useUpdateSession(sessionId: string, boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSessionPayload) => sessionService.update(sessionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.detail(sessionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.byBoard(boardId) });
      toast.success('Session updated!');
    },
  });
}

export function useJoinSession() {
  return useMutation({
    mutationFn: (sessionId: string) => sessionService.join(sessionId),
  });
}

export function useLeaveSession() {
  return useMutation({
    mutationFn: (sessionId: string) => sessionService.leave(sessionId),
  });
}

export function useSessionAnalytics(sessionId: string) {
  return useQuery({
    queryKey: queryKeys.sessions.analytics(sessionId),
    queryFn: () => sessionService.getAnalytics(sessionId),
    enabled: !!sessionId,
  });
}
