'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clusterService } from '@/services/cluster.service';
import { queryKeys } from '@/constants/query-keys';
import type { CreateClusterPayload, UpdateClusterPayload, ClusterIdeasPayload } from '@/types/cluster.types';

export function useClusters(sessionId: string) {
  return useQuery({
    queryKey: queryKeys.clusters.bySession(sessionId),
    queryFn: () => clusterService.getBySession(sessionId),
    enabled: !!sessionId,
  });
}

export function useCreateCluster(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateClusterPayload) => clusterService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clusters.bySession(sessionId) });
      toast.success('Cluster created!');
    },
  });
}

export function useUpdateCluster(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clusterId, payload }: { clusterId: string; payload: UpdateClusterPayload }) =>
      clusterService.update(clusterId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clusters.bySession(sessionId) });
      toast.success('Cluster updated!');
    },
  });
}

export function useAddIdeasToCluster(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clusterId, payload }: { clusterId: string; payload: ClusterIdeasPayload }) =>
      clusterService.addIdeas(clusterId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clusters.bySession(sessionId) });
      toast.success('Ideas added to cluster');
    },
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
  });
}
