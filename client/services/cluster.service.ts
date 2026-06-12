import apiClient from './api-client';
import type { ApiResponse } from '@/types/api';
import type { Cluster } from '@/types/models';
import type { CreateClusterInput, UpdateClusterInput } from '@/lib/validators';

export const clusterService = {
  create: (data: CreateClusterInput) =>
    apiClient.post<ApiResponse<Cluster>>('/api/clusters', data).then(r => r.data.data),

  getBySession: (sessionId: string) =>
    apiClient.get<ApiResponse<Cluster[]>>(`/api/clusters/session/${sessionId}`).then(r => r.data.data),

  update: (clusterId: string, data: UpdateClusterInput) =>
    apiClient.put<ApiResponse<Cluster>>(`/api/clusters/${clusterId}`, data).then(r => r.data.data),

  addIdeas: (clusterId: string, ideaIds: string[]) =>
    apiClient.post(`/api/clusters/${clusterId}/ideas`, { ideaIds }).then(r => r.data),

  removeIdeas: (clusterId: string, ideaIds: string[]) =>
    apiClient.delete(`/api/clusters/${clusterId}/ideas`, { data: { ideaIds } }).then(r => r.data),

  delete: (clusterId: string) =>
    apiClient.delete(`/api/clusters/${clusterId}`).then(r => r.data),
};
