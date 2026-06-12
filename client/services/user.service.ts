import apiClient from './api-client';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/models';
import type { UpdateProfileInput } from '@/lib/validators';

export const userService = {
  getMe: () =>
    apiClient.get<ApiResponse<User>>('/api/users/me').then(r => r.data.data),

  updateMe: (data: UpdateProfileInput) =>
    apiClient.put<ApiResponse<User>>('/api/users/me', data).then(r => r.data.data),

  search: (q: string) =>
    apiClient.get<ApiResponse<User[]>>('/api/users/search', { params: { q } }).then(r => r.data.data),
};
