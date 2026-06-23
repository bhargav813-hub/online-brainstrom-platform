'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { voteService } from '@/services/vote.service';
import { queryKeys } from '@/constants/query-keys';
import type { CastVotePayload } from '@/types/vote.types';

export function useCastVote(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CastVotePayload) => voteService.castVote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ideas.hierarchy(sessionId) });
    },
  });
}

export function useRemoveVote(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ideaId: string) => voteService.removeVote(ideaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ideas.hierarchy(sessionId) });
      toast.success('Vote removed');
    },
  });
}

export function useVotesByIdea(ideaId: string) {
  return useQuery({
    queryKey: queryKeys.votes.byIdea(ideaId),
    queryFn: () => voteService.getByIdea(ideaId),
    enabled: !!ideaId,
  });
}

export function useVoteAnalytics(sessionId: string) {
  return useQuery({
    queryKey: queryKeys.votes.analytics(sessionId),
    queryFn: () => voteService.getAnalytics(sessionId),
    enabled: !!sessionId,
  });
}
