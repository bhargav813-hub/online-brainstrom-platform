import apiClient from './api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  Session,
  CreateSessionPayload,
  UpdateSessionPayload,
  SessionAnalytics,
} from '@/types/session.types';

export const sessionService = {
  getByBoard: async (boardId: string, page = 1, limit = 20) => {
    const { data } = await apiClient.get<PaginatedResponse<Session>>(
      `/sessions/board/${boardId}?page=${page}&limit=${limit}`
    );
    return data;
  },

  getById: async (sessionId: string) => {
    const { data } = await apiClient.get<ApiResponse<Session>>(`/sessions/${sessionId}`);
    return data.data;
  },

  create: async (payload: CreateSessionPayload) => {
    const { data } = await apiClient.post<ApiResponse<Session>>('/sessions', payload);
    return data.data;
  },

  update: async (sessionId: string, payload: UpdateSessionPayload) => {
    const { data } = await apiClient.put<ApiResponse<Session>>(
      `/sessions/${sessionId}`,
      payload
    );
    return data.data;
  },

  join: async (sessionId: string) => {
    const { data } = await apiClient.post<ApiResponse<null>>(`/sessions/${sessionId}/join`);
    return data;
  },

  leave: async (sessionId: string) => {
    const { data } = await apiClient.post<ApiResponse<null>>(`/sessions/${sessionId}/leave`);
    return data;
  },

  getAnalytics: async (sessionId: string) => {
    const { data } = await apiClient.get<ApiResponse<SessionAnalytics>>(
      `/sessions/${sessionId}/analytics`
    );
    return data.data;
  },
};
