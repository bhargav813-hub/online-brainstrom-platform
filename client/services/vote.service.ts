import apiClient from './api-client';
import type { ApiResponse } from '@/types/api';
import type { Vote, VoteAnalytics } from '@/types/models';
import type { CastVoteInput } from '@/lib/validators';

export const voteService = {
  cast: (data: CastVoteInput) =>
    apiClient.post<ApiResponse<Vote>>('/api/votes', data).then(r => r.data.data),

  remove: (ideaId: string) =>
    apiClient.delete(`/api/votes/idea/${ideaId}`).then(r => r.data),

  getAnalytics: (sessionId: string) =>
    apiClient.get<ApiResponse<VoteAnalytics>>(`/api/votes/session/${sessionId}/analytics`).then(r => r.data.data),

  getMyVotes: (sessionId: string) =>
    apiClient.get<ApiResponse<Vote[]>>(`/api/votes/session/${sessionId}/my-votes`).then(r => r.data.data),

  getByIdea: (ideaId: string) =>
    apiClient.get<ApiResponse<Vote[]>>(`/api/votes/idea/${ideaId}`).then(r => r.data.data),
};
