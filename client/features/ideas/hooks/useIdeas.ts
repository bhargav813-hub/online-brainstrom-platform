'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ideaService } from '@/services/idea.service';
import { queryKeys } from '@/lib/queryKeys';
import type { CreateIdeaInput, UpdateIdeaInput } from '@/lib/validators';

export function useCreateIdea(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateIdeaInput) => ideaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ideas.hierarchy(sessionId) });
      toast.success('Idea added!');
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}

export function useUpdateIdea(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ideaId, data }: { ideaId: string; data: UpdateIdeaInput }) =>
      ideaService.update(ideaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ideas.hierarchy(sessionId) });
      toast.success('Idea updated');
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}

export function useDeleteIdea(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ideaId: string) => ideaService.delete(ideaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ideas.hierarchy(sessionId) });
      toast.success('Idea deleted');
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}

export function useMoveIdea(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ideaId, newParentId }: { ideaId: string; newParentId: string | null }) =>
      ideaService.move(ideaId, newParentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ideas.hierarchy(sessionId) });
      toast.success('Idea moved');
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}

export function useRestoreIdeaVersion(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ideaId, version }: { ideaId: string; version: number }) =>
      ideaService.restoreVersion(ideaId, version),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ideas.hierarchy(sessionId) });
      toast.success('Version restored');
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}

export function useIdeaVersions(ideaId: string) {
  return useQuery({
    queryKey: queryKeys.ideas.versions(ideaId),
    queryFn: () => ideaService.getVersionHistory(ideaId),
    enabled: !!ideaId,
  });
}

export function useIdeaSearch(sessionId: string, query: string, page = 1) {
  return useQuery({
    queryKey: queryKeys.ideas.search(sessionId, query),
    queryFn: () => ideaService.search(sessionId, query, page),
    enabled: !!sessionId && query.length >= 2,
  });
}
