import apiClient from './api-client';
import type { ApiResponse } from '@/types/api';
import type { Workspace } from '@/types/models';
import type { UserRole } from '@/types/common';
import type { CreateWorkspaceInput, UpdateWorkspaceInput, InviteUserInput } from '@/lib/validators';

export const workspaceService = {
  create: (data: CreateWorkspaceInput) =>
    apiClient.post<ApiResponse<Workspace>>('/api/workspaces', data).then(r => r.data.data),

  getAll: () =>
    apiClient.get<ApiResponse<Workspace[]>>('/api/workspaces').then(r => r.data.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Workspace>>(`/api/workspaces/${id}`).then(r => r.data.data),

  update: (id: string, data: UpdateWorkspaceInput) =>
    apiClient.put<ApiResponse<Workspace>>(`/api/workspaces/${id}`, data).then(r => r.data.data),

  delete: (id: string) =>
    apiClient.delete(`/api/workspaces/${id}`).then(r => r.data),

  invite: (id: string, data: InviteUserInput) =>
    apiClient.post(`/api/workspaces/${id}/invite`, data).then(r => r.data),

  assignRole: (id: string, userId: string, role: UserRole) =>
    apiClient.put(`/api/workspaces/${id}/assign-role`, { userId, role }).then(r => r.data),

  removeMember: (id: string, userId: string) =>
    apiClient.delete(`/api/workspaces/${id}/members/${userId}`).then(r => r.data),
};
