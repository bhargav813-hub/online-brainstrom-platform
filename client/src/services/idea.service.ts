import apiClient from './api-client';
import type { ApiResponse } from '@/types/api.types';
import type {
  Idea,
  CreateIdeaPayload,
  UpdateIdeaPayload,
  MoveIdeaPayload,
  IdeaVersion,
} from '@/types/idea.types';

export const ideaService = {
  create: async (payload: CreateIdeaPayload) => {
    const { data } = await apiClient.post<ApiResponse<Idea>>('/ideas', payload);
    return data.data;
  },

  update: async (ideaId: string, payload: UpdateIdeaPayload) => {
    const { data } = await apiClient.put<ApiResponse<Idea>>(`/ideas/${ideaId}`, payload);
    return data.data;
  },

  delete: async (ideaId: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/ideas/${ideaId}`);
    return data;
  },

  move: async (ideaId: string, payload: MoveIdeaPayload) => {
    const { data } = await apiClient.patch<ApiResponse<Idea>>(`/ideas/${ideaId}/move`, payload);
    return data.data;
  },

  getHierarchy: async (sessionId: string) => {
    const { data } = await apiClient.get<ApiResponse<Idea[]>>(
      `/ideas/session/${sessionId}/hierarchy`
    );
    
    // Rebuild tree from flat list
    const ideas = data.data;
    const ideaMap = new Map<string, Idea>();
    const roots: Idea[] = [];
    
    // Initialize map
    ideas.forEach(idea => {
      idea.children = [];
      ideaMap.set(idea._id, idea);
    });
    
    // Build tree
    ideas.forEach(idea => {
      if (idea.parentIdea && ideaMap.has(idea.parentIdea)) {
        ideaMap.get(idea.parentIdea)!.children!.push(idea);
      } else {
        roots.push(idea);
      }
    });
    
    return roots;
  },

  getChildren: async (ideaId: string) => {
    const { data } = await apiClient.get<ApiResponse<Idea[]>>(`/ideas/${ideaId}/children`);
    return data.data;
  },

  search: async (sessionId: string, query: string) => {
    const { data } = await apiClient.get<ApiResponse<Idea[]>>(
      `/ideas/session/${sessionId}/search?q=${encodeURIComponent(query)}`
    );
    return data.data;
  },

  getVersions: async (ideaId: string) => {
    const { data } = await apiClient.get<ApiResponse<IdeaVersion[]>>(
      `/ideas/${ideaId}/versions`
    );
    return data.data;
  },

  restoreVersion: async (ideaId: string, version: number) => {
    const { data } = await apiClient.post<ApiResponse<Idea>>(
      `/ideas/${ideaId}/restore/${version}`
    );
    return data.data;
  },
};
