'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ideaService } from '@/services/idea.service';
import { queryKeys } from '@/constants/query-keys';
import { useDebounce } from '@/hooks/useDebounce';
import type { CreateIdeaPayload, UpdateIdeaPayload, MoveIdeaPayload } from '@/types/idea.types';

export function useIdeaHierarchy(sessionId: string) {
  return useQuery({
    queryKey: queryKeys.ideas.hierarchy(sessionId),
    queryFn: () => ideaService.getHierarchy(sessionId),
    enabled: !!sessionId,
  });
}

export function useIdeaSearch(sessionId: string, query: string) {
  const debouncedQuery = useDebounce(query, 300);
  return useQuery({
    queryKey: queryKeys.ideas.search(sessionId, debouncedQuery),
    queryFn: () => ideaService.search(sessionId, debouncedQuery),
    enabled: !!sessionId && debouncedQuery.length >= 2,
  });
}

export function useIdeaVersions(ideaId: string) {
  return useQuery({
    queryKey: queryKeys.ideas.versions(ideaId),
    queryFn: () => ideaService.getVersions(ideaId),
    enabled: !!ideaId,
  });
}

export function useCreateIdea(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateIdeaPayload) => ideaService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ideas.hierarchy(sessionId) });
      toast.success('Idea added!');
    },
  });
}

export function useUpdateIdea(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ideaId, payload }: { ideaId: string; payload: UpdateIdeaPayload }) =>
      ideaService.update(ideaId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ideas.hierarchy(sessionId) });
      toast.success('Idea updated!');
    },
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
  });
}

export function useMoveIdea(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ideaId, payload }: { ideaId: string; payload: MoveIdeaPayload }) =>
      ideaService.move(ideaId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ideas.hierarchy(sessionId) });
      toast.success('Idea moved!');
    },
  });
}

export function useRestoreVersion(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ideaId, version }: { ideaId: string; version: number }) =>
      ideaService.restoreVersion(ideaId, version),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ideas.hierarchy(sessionId) });
      toast.success('Version restored!');
    },
  });
}
