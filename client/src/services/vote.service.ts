import apiClient from './api-client';
import type { ApiResponse } from '@/types/api.types';
import type { Vote, CastVotePayload, VoteAnalytics } from '@/types/vote.types';

export const voteService = {
  castVote: async (payload: CastVotePayload) => {
    const { data } = await apiClient.post<ApiResponse<Vote>>('/votes', payload);
    return data.data;
  },

  removeVote: async (ideaId: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/votes/idea/${ideaId}`);
    return data;
  },

  getByIdea: async (ideaId: string) => {
    const { data } = await apiClient.get<ApiResponse<Vote[]>>(`/votes/idea/${ideaId}`);
    return data.data;
  },

  getAnalytics: async (sessionId: string) => {
    const { data } = await apiClient.get<ApiResponse<VoteAnalytics>>(
      `/votes/session/${sessionId}/analytics`
    );
    return data.data;
  },
};
