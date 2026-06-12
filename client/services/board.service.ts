import apiClient from './api-client';
import type { ApiResponse } from '@/types/api';
import type { Board } from '@/types/models';
import type { CreateBoardInput, UpdateBoardInput } from '@/lib/validators';

export const boardService = {
  create: (data: CreateBoardInput) =>
    apiClient.post<ApiResponse<Board>>('/api/boards', data).then(r => r.data.data),

  getByWorkspace: (workspaceId: string, includeArchived = false) =>
    apiClient.get<ApiResponse<Board[]>>(`/api/boards/workspace/${workspaceId}`, {
      params: includeArchived ? { includeArchived: 'true' } : {},
    }).then(r => r.data.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Board>>(`/api/boards/${id}`).then(r => r.data.data),

  update: (id: string, data: UpdateBoardInput) =>
    apiClient.put<ApiResponse<Board>>(`/api/boards/${id}`, data).then(r => r.data.data),

  archive: (id: string) =>
    apiClient.patch(`/api/boards/${id}/archive`).then(r => r.data),

  unarchive: (id: string) =>
    apiClient.patch(`/api/boards/${id}/unarchive`).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete(`/api/boards/${id}`).then(r => r.data),

  toggleGuestAccess: (id: string, enabled: boolean) =>
    apiClient.patch<ApiResponse<Board>>(`/api/boards/${id}/guest-access`, { enabled }).then(r => r.data.data),
};
