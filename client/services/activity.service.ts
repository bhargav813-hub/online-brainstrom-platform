import apiClient from './api-client';
import type { PaginatedResponse } from '@/types/api';
import type { ActivityLog } from '@/types/models';
import type { ActivityAction } from '@/types/common';

export const activityService = {
  getBySession: (sessionId: string, page = 1, limit = 20) =>
    apiClient.get<PaginatedResponse<ActivityLog>>(`/api/activity/session/${sessionId}`, {
      params: { page, limit },
    }).then(r => r.data),

  getFiltered: (sessionId: string, action: ActivityAction, page = 1) =>
    apiClient.get<PaginatedResponse<ActivityLog>>(`/api/activity/session/${sessionId}/filter`, {
      params: { action, page },
    }).then(r => r.data),

  getByUser: (sessionId: string, userId: string, page = 1) =>
    apiClient.get<PaginatedResponse<ActivityLog>>(`/api/activity/session/${sessionId}/user/${userId}`, {
      params: { page },
    }).then(r => r.data),
};
