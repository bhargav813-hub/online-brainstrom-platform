import apiClient from './api-client';
import type { ApiResponse } from '@/types/api.types';
import type { User, UpdateProfilePayload, ChangePasswordPayload, UserSearchResult } from '@/types/user.types';

export const userService = {
  getMe: async () => {
    const { data } = await apiClient.get<ApiResponse<User>>('/users/me');
    return data.data;
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    const { data } = await apiClient.put<ApiResponse<User>>('/users/me', payload);
    return data.data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const { data } = await apiClient.put<ApiResponse<null>>('/users/change-password', payload);
    return data;
  },

  searchUsers: async (query: string) => {
    const { data } = await apiClient.get<ApiResponse<UserSearchResult[]>>(`/users/search?q=${encodeURIComponent(query)}`);
    return data.data;
  },
};
