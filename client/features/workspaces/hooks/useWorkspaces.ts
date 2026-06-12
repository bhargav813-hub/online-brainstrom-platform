'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workspaceService } from '@/services/workspace.service';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/constants/queryConfig';
import type { CreateWorkspaceInput, UpdateWorkspaceInput } from '@/lib/validators';

export function useWorkspaces() {
  return useQuery({
    queryKey: queryKeys.workspaces.all,
    queryFn: workspaceService.getAll,
    staleTime: QUERY_CONFIG.staleTime.workspace,
    gcTime: QUERY_CONFIG.gcTime.workspace,
  });
}

export function useWorkspace(id: string) {
  return useQuery({
    queryKey: queryKeys.workspaces.detail(id),
    queryFn: () => workspaceService.getById(id),
    enabled: !!id,
    staleTime: QUERY_CONFIG.staleTime.workspace,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWorkspaceInput) => workspaceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.all });
      toast.success('Workspace created!');
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}

export function useUpdateWorkspace(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateWorkspaceInput) => workspaceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.all });
      toast.success('Workspace updated!');
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workspaceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.all });
      toast.success('Workspace deleted');
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}
