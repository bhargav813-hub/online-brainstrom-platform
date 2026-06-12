'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clusterService } from '@/services/cluster.service';
import { sharedService } from '@/services/shared.service';
import { queryKeys } from '@/lib/queryKeys';
import type { CreateClusterInput, UpdateClusterInput } from '@/lib/validators';

export function useClusters(sessionId: string, shareToken?: string) {
  return useQuery({
    queryKey: shareToken
      ? ['shared', 'clusters', shareToken, sessionId]
      : queryKeys.clusters.bySession(sessionId),
    queryFn: () =>
      shareToken
        ? sharedService.getClusters(shareToken, sessionId)
        : clusterService.getBySession(sessionId),
    enabled: !!sessionId,
  });
}

export function useCreateCluster(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateClusterInput) => clusterService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clusters.bySession(sessionId) });
      toast.success('Cluster created!');
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}

export function useUpdateCluster(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clusterId, data }: { clusterId: string; data: UpdateClusterInput }) =>
      clusterService.update(clusterId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clusters.bySession(sessionId) });
      toast.success('Cluster updated');
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}

export function useDeleteCluster(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clusterId: string) => clusterService.delete(clusterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clusters.bySession(sessionId) });
      toast.success('Cluster deleted');
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}

export function useAddIdeasToCluster(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clusterId, ideaIds }: { clusterId: string; ideaIds: string[] }) =>
      clusterService.addIdeas(clusterId, ideaIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clusters.bySession(sessionId) });
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}

export function useRemoveIdeasFromCluster(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clusterId, ideaIds }: { clusterId: string; ideaIds: string[] }) =>
      clusterService.removeIdeas(clusterId, ideaIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clusters.bySession(sessionId) });
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}
