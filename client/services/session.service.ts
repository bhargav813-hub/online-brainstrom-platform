import apiClient from './api-client';
import type { ApiResponse } from '@/types/api';
import type { Session, SessionParticipant, SessionAnalytics } from '@/types/models';
import type { SessionStatus } from '@/types/common';
import type { CreateSessionInput, UpdateSessionInput } from '@/lib/validators';

export const sessionService = {
  create: (data: CreateSessionInput) =>
    apiClient.post<ApiResponse<Session>>('/api/sessions', data).then(r => r.data.data),

  getByBoard: (boardId: string, status?: SessionStatus) =>
    apiClient.get<ApiResponse<Session[]>>(`/api/sessions/board/${boardId}`, {
      params: status ? { status } : {},
    }).then(r => r.data.data),

  getById: (id: string) =>
    apiClient
      .get<ApiResponse<{ session: Session; participants: SessionParticipant[] }>>(`/api/sessions/${id}`)
      .then(r => ({ ...r.data.data.session, participants: r.data.data.participants })),

  update: (id: string, data: UpdateSessionInput) =>
    apiClient.put<ApiResponse<Session>>(`/api/sessions/${id}`, data).then(r => r.data.data),

  join: (id: string) =>
    apiClient.post(`/api/sessions/${id}/join`).then(r => r.data),

  leave: (id: string) =>
    apiClient.post(`/api/sessions/${id}/leave`).then(r => r.data),

  invite: (id: string, email: string) =>
    apiClient.post(`/api/sessions/${id}/invite`, { email }).then(r => r.data),

  getAnalytics: (id: string) =>
    apiClient.get<ApiResponse<SessionAnalytics>>(`/api/sessions/${id}/analytics`).then(r => r.data.data),
};
