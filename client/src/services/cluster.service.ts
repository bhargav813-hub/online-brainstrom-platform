import apiClient from './api-client';
import type { ApiResponse } from '@/types/api.types';
import type {
  Cluster,
  CreateClusterPayload,
  UpdateClusterPayload,
  ClusterIdeasPayload,
} from '@/types/cluster.types';

export const clusterService = {
  getBySession: async (sessionId: string) => {
    const { data } = await apiClient.get<ApiResponse<Cluster[]>>(
      `/clusters/session/${sessionId}`
    );
    return data.data;
  },

  create: async (payload: CreateClusterPayload) => {
    const { data } = await apiClient.post<ApiResponse<Cluster>>('/clusters', payload);
    return data.data;
  },

  update: async (clusterId: string, payload: UpdateClusterPayload) => {
    const { data } = await apiClient.put<ApiResponse<Cluster>>(
      `/clusters/${clusterId}`,
      payload
    );
    return data.data;
  },

  addIdeas: async (clusterId: string, payload: ClusterIdeasPayload) => {
    const { data } = await apiClient.post<ApiResponse<Cluster>>(
      `/clusters/${clusterId}/ideas`,
      payload
    );
    return data.data;
  },

  removeIdeas: async (clusterId: string, payload: ClusterIdeasPayload) => {
    const { data } = await apiClient.delete<ApiResponse<Cluster>>(
      `/clusters/${clusterId}/ideas`,
      { data: payload }
    );
    return data.data;
  },

  delete: async (clusterId: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/clusters/${clusterId}`);
    return data;
  },
};
