import apiClient from './api-client';
import type { PaginatedResponse } from '@/types/api.types';
import type { ActivityLog } from '@/types/activity.types';

export const activityService = {
  getBySession: async (sessionId: string, page = 1, limit = 20) => {
    const { data } = await apiClient.get<PaginatedResponse<ActivityLog>>(
      `/activity/session/${sessionId}?page=${page}&limit=${limit}`
    );
    return data;
  },

  getFiltered: async (sessionId: string, action: string, page = 1, limit = 20) => {
    const { data } = await apiClient.get<PaginatedResponse<ActivityLog>>(
      `/activity/session/${sessionId}/filter?action=${action}&page=${page}&limit=${limit}`
    );
    return data;
  },

  getByUser: async (sessionId: string, userId: string, page = 1, limit = 20) => {
    const { data } = await apiClient.get<PaginatedResponse<ActivityLog>>(
      `/activity/session/${sessionId}/user/${userId}?page=${page}&limit=${limit}`
    );
    return data;
  },
};
