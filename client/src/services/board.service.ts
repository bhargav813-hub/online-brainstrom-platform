import apiClient from './api-client';
import type { ApiResponse } from '@/types/api.types';
import type { Board, CreateBoardPayload, UpdateBoardPayload, ExportFormat, SharedBoardResponse } from '@/types/board.types';

export const boardService = {
  getByWorkspace: async (workspaceId: string) => {
    const { data } = await apiClient.get<ApiResponse<Board[]>>(`/boards/workspace/${workspaceId}`);
    return data.data;
  },

  getById: async (boardId: string) => {
    const { data } = await apiClient.get<ApiResponse<Board>>(`/boards/${boardId}`);
    return data.data;
  },

  create: async (payload: CreateBoardPayload) => {
    const { data } = await apiClient.post<ApiResponse<Board>>('/boards', payload);
    return data.data;
  },

  update: async (boardId: string, payload: UpdateBoardPayload) => {
    const { data } = await apiClient.put<ApiResponse<Board>>(`/boards/${boardId}`, payload);
    return data.data;
  },

  archive: async (boardId: string) => {
    const { data } = await apiClient.patch<ApiResponse<Board>>(`/boards/${boardId}/archive`);
    return data.data;
  },

  unarchive: async (boardId: string) => {
    const { data } = await apiClient.patch<ApiResponse<Board>>(`/boards/${boardId}/unarchive`);
    return data.data;
  },

  delete: async (boardId: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/boards/${boardId}`);
    return data;
  },

  share: async (boardId: string) => {
    const { data } = await apiClient.post<ApiResponse<Board>>(`/boards/${boardId}/share`);
    return data.data;
  },

  unshare: async (boardId: string) => {
    const { data } = await apiClient.post<ApiResponse<Board>>(`/boards/${boardId}/unshare`);
    return data.data;
  },

  getShared: async (shareToken: string) => {
    const { data } = await apiClient.get<ApiResponse<SharedBoardResponse>>(`/boards/shared/${shareToken}`);
    return data.data;
  },

  exportBoard: async (boardId: string, format: ExportFormat) => {
    if (format === 'pdf') {
      const response = await apiClient.get(`/boards/${boardId}/export?format=pdf`, {
        responseType: 'blob',
      });
      return response.data as Blob;
    }
    const { data } = await apiClient.get(`/boards/${boardId}/export?format=json`);
    return data;
  },
};
