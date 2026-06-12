'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sessionService } from '@/services/session.service';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/constants/queryConfig';
import type { CreateSessionInput, UpdateSessionInput } from '@/lib/validators';
import type { SessionStatus } from '@/types/common';

export function useSessions(boardId: string, status?: SessionStatus) {
  return useQuery({
    queryKey: [...queryKeys.sessions.byBoard(boardId), status],
    queryFn: () => sessionService.getByBoard(boardId, status),
    enabled: !!boardId,
    staleTime: QUERY_CONFIG.staleTime.session,
  });
}

export function useSession(id: string) {
  return useQuery({
    queryKey: queryKeys.sessions.detail(id),
    queryFn: () => sessionService.getById(id),
    enabled: !!id,
    staleTime: QUERY_CONFIG.staleTime.session,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSessionInput) => sessionService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.byBoard(variables.boardId) });
      toast.success('Session created!');
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}

export function useUpdateSession(sessionId: string, boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateSessionInput) => sessionService.update(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.detail(sessionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.byBoard(boardId) });
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}

export function useJoinSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => sessionService.join(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.detail(sessionId) });
      toast.success('Joined session!');
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}

export function useLeaveSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => sessionService.leave(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.detail(sessionId) });
      toast.info('Left session');
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}

export function useInviteToSession(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => sessionService.invite(sessionId, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.detail(sessionId) });
      toast.success('Member added to session!');
    },
    onError: (error: { message: string }) => toast.error(error.message || 'Failed to add member'),
  });
}

export function useSessionAnalytics(sessionId: string) {
  return useQuery({
    queryKey: queryKeys.sessions.analytics(sessionId),
    queryFn: () => sessionService.getAnalytics(sessionId),
    enabled: !!sessionId,
    staleTime: QUERY_CONFIG.staleTime.voteAnalytics,
  });
}
