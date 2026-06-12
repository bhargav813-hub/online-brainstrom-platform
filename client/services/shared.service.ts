import apiClient from './api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Board, Session, SessionParticipant, Idea, VoteAnalytics, ActivityLog, Cluster, SessionAnalytics } from '@/types/models';

export const sharedService = {
  getBoard: (shareToken: string) =>
    apiClient
      .get<ApiResponse<{ board: Board; sessions: Session[] }>>(`/api/shared/board/${shareToken}`)
      .then((r) => r.data.data),

  getSession: (shareToken: string, sessionId: string) =>
    apiClient
      .get<ApiResponse<{ session: Session; participants: SessionParticipant[]; analytics: SessionAnalytics }>>(`/api/shared/session/${shareToken}/${sessionId}`)
      .then((r) => r.data.data),

  getIdeasHierarchy: (shareToken: string, sessionId: string) =>
    apiClient
      .get<ApiResponse<Idea[]>>(`/api/shared/ideas/${shareToken}/${sessionId}/hierarchy`)
      .then((r) => r.data.data),

  getClusters: (shareToken: string, sessionId: string) =>
    apiClient
      .get<ApiResponse<Cluster[]>>(`/api/shared/clusters/${shareToken}/${sessionId}`)
      .then((r) => r.data.data),

  getVoteAnalytics: (shareToken: string, sessionId: string) =>
    apiClient
      .get<ApiResponse<VoteAnalytics>>(`/api/shared/votes/${shareToken}/${sessionId}/analytics`)
      .then((r) => r.data.data),

  getActivityTimeline: (shareToken: string, sessionId: string, page = 1, limit = 20) =>
    apiClient
      .get<PaginatedResponse<ActivityLog>>(`/api/shared/activity/${shareToken}/${sessionId}`, {
        params: { page, limit },
      })
      .then((r) => r.data),
};
