import apiClient from './api-client';
import type { ApiResponse } from '@/types/api.types';
import type {
  Workspace,
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
  InviteMemberPayload,
  AssignRolePayload,
} from '@/types/workspace.types';

export const workspaceService = {
  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<Workspace[]>>('/workspaces');
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Workspace>>(`/workspaces/${id}`);
    return data.data;
  },

  create: async (payload: CreateWorkspacePayload) => {
    const { data } = await apiClient.post<ApiResponse<Workspace>>('/workspaces', payload);
    return data.data;
  },

  update: async (id: string, payload: UpdateWorkspacePayload) => {
    const { data } = await apiClient.put<ApiResponse<Workspace>>(`/workspaces/${id}`, payload);
    return data.data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/workspaces/${id}`);
    return data;
  },

  inviteMember: async (workspaceId: string, payload: InviteMemberPayload) => {
    const { data } = await apiClient.post<ApiResponse<Workspace>>(
      `/workspaces/${workspaceId}/invite`,
      payload
    );
    return data.data;
  },

  assignRole: async (workspaceId: string, payload: AssignRolePayload) => {
    const { data } = await apiClient.put<ApiResponse<Workspace>>(
      `/workspaces/${workspaceId}/assign-role`,
      payload
    );
    return data.data;
  },

  removeMember: async (workspaceId: string, userId: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(
      `/workspaces/${workspaceId}/members/${userId}`
    );
    return data;
  },
};
