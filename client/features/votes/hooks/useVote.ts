'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { voteService } from '@/services/vote.service';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/constants/queryConfig';
import type { CastVoteInput } from '@/lib/validators';
import type { Idea, Vote } from '@/types/models';

export function useUserVotes(sessionId: string) {
  return useQuery({
    queryKey: queryKeys.votes.myVotes(sessionId),
    queryFn: () => voteService.getMyVotes(sessionId),
    enabled: !!sessionId,
  });
}

export function useCastVote(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CastVoteInput) => voteService.cast(data),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.ideas.hierarchy(sessionId) });
      await queryClient.cancelQueries({ queryKey: queryKeys.votes.myVotes(sessionId) });

      const previousIdeas = queryClient.getQueryData<Idea[]>(queryKeys.ideas.hierarchy(sessionId));
      const previousMyVotes = queryClient.getQueryData<Vote[]>(queryKeys.votes.myVotes(sessionId)) || [];

      const existingVote = previousMyVotes.find((v) => v.idea === variables.ideaId);

      // 1. Update myVotes cache
      queryClient.setQueryData<Vote[]>(
        queryKeys.votes.myVotes(sessionId),
        (old) => {
          const newVote = {
            _id: existingVote?._id || 'temp-id',
            idea: variables.ideaId,
            user: { _id: 'current-user' } as any,
            session: sessionId,
            type: variables.type as any,
            weight: variables.weight || 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          if (existingVote) {
            return old?.map((v) => (v.idea === variables.ideaId ? newVote : v)) ?? [newVote];
          }
          return [...(old || []), newVote];
        }
      );

      // 2. Update ideas count
      queryClient.setQueryData<Idea[]>(
        queryKeys.ideas.hierarchy(sessionId),
        (old) =>
          old?.map((idea) => {
            if (idea._id !== variables.ideaId) return idea;

            let upDiff = 0;
            let downDiff = 0;

            if (existingVote) {
              if (existingVote.type === 'upvote') upDiff -= 1;
              if (existingVote.type === 'downvote') downDiff -= 1;
            }

            if (variables.type === 'upvote') upDiff += 1;
            if (variables.type === 'downvote') downDiff += 1;

            return {
              ...idea,
              upvoteCount: Math.max(0, idea.upvoteCount + upDiff),
              downvoteCount: Math.max(0, idea.downvoteCount + downDiff),
            };
          }) ?? []
      );

      return { previousIdeas, previousMyVotes };
    },
    onError: (error: { message: string }, _, context) => {
      if (context) {
        queryClient.setQueryData(queryKeys.ideas.hierarchy(sessionId), context.previousIdeas);
        queryClient.setQueryData(queryKeys.votes.myVotes(sessionId), context.previousMyVotes);
      }
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.votes.myVotes(sessionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.votes.analytics(sessionId) });
    },
  });
}

export function useRemoveVote(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ideaId: string) => voteService.remove(ideaId),
    onMutate: async (ideaId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.ideas.hierarchy(sessionId) });
      await queryClient.cancelQueries({ queryKey: queryKeys.votes.myVotes(sessionId) });

      const previousIdeas = queryClient.getQueryData<Idea[]>(queryKeys.ideas.hierarchy(sessionId));
      const previousMyVotes = queryClient.getQueryData<Vote[]>(queryKeys.votes.myVotes(sessionId)) || [];

      const existingVote = previousMyVotes.find((v) => v.idea === ideaId);

      // 1. Update myVotes cache
      queryClient.setQueryData<Vote[]>(
        queryKeys.votes.myVotes(sessionId),
        (old) => old?.filter((v) => v.idea !== ideaId) ?? []
      );

      // 2. Update ideas count
      if (existingVote) {
        queryClient.setQueryData<Idea[]>(
          queryKeys.ideas.hierarchy(sessionId),
          (old) =>
            old?.map((idea) => {
              if (idea._id !== ideaId) return idea;
              return {
                ...idea,
                upvoteCount: existingVote.type === 'upvote' ? Math.max(0, idea.upvoteCount - 1) : idea.upvoteCount,
                downvoteCount: existingVote.type === 'downvote' ? Math.max(0, idea.downvoteCount - 1) : idea.downvoteCount,
              };
            }) ?? []
        );
      }

      return { previousIdeas, previousMyVotes };
    },
    onError: (error: { message: string }, _, context) => {
      if (context) {
        queryClient.setQueryData(queryKeys.ideas.hierarchy(sessionId), context.previousIdeas);
        queryClient.setQueryData(queryKeys.votes.myVotes(sessionId), context.previousMyVotes);
      }
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.votes.myVotes(sessionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.votes.analytics(sessionId) });
    },
  });
}

export function useVoteAnalytics(sessionId: string) {
  return useQuery({
    queryKey: queryKeys.votes.analytics(sessionId),
    queryFn: () => voteService.getAnalytics(sessionId),
    enabled: !!sessionId,
    staleTime: QUERY_CONFIG.staleTime.voteAnalytics,
  });
}
