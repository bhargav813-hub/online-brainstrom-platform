import apiClient from './api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Idea, IdeaVersion } from '@/types/models';
import type { CreateIdeaInput, UpdateIdeaInput } from '@/lib/validators';

export const ideaService = {
  create: (data: CreateIdeaInput) =>
    apiClient.post<ApiResponse<Idea>>('/api/ideas', data).then(r => r.data.data),

  update: (ideaId: string, data: UpdateIdeaInput) =>
    apiClient.put<ApiResponse<Idea>>(`/api/ideas/${ideaId}`, data).then(r => r.data.data),

  delete: (ideaId: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/ideas/${ideaId}`).then(r => r.data),

  move: (ideaId: string, newParentId: string | null) =>
    apiClient.patch<ApiResponse<Idea>>(`/api/ideas/${ideaId}/move`, { newParentId }).then(r => r.data.data),

  getHierarchy: (sessionId: string) =>
    apiClient.get<ApiResponse<Idea[]>>(`/api/ideas/session/${sessionId}/hierarchy`).then(r => r.data.data),

  getChildren: (ideaId: string) =>
    apiClient.get<ApiResponse<Idea[]>>(`/api/ideas/${ideaId}/children`).then(r => r.data.data),

  search: (sessionId: string, q: string, page = 1) =>
    apiClient.get<PaginatedResponse<Idea>>(`/api/ideas/session/${sessionId}/search`, {
      params: { q, page },
    }).then(r => r.data),

  getVersionHistory: (ideaId: string) =>
    apiClient.get<ApiResponse<IdeaVersion[]>>(`/api/ideas/${ideaId}/versions`).then(r => r.data.data),

  restoreVersion: (ideaId: string, version: number) =>
    apiClient.post<ApiResponse<Idea>>(`/api/ideas/${ideaId}/restore/${version}`).then(r => r.data.data),
};
