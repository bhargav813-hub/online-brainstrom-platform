import apiClient from './api-client';
import type { ApiResponse, LoginResponse, RegisterResponse, RefreshTokenResponse } from '@/types/api';
import type { LoginInput, RegisterInput } from '@/lib/validators';

export const authService = {
  register: (data: RegisterInput) =>
    apiClient.post<ApiResponse<RegisterResponse>>('/api/auth/register', data).then(r => r.data.data),

  login: (data: LoginInput) =>
    apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', data).then(r => r.data.data),

  refreshToken: (refreshToken: string) =>
    apiClient.post<ApiResponse<RefreshTokenResponse>>('/api/auth/refresh-token', { refreshToken }).then(r => r.data.data),

  logout: () =>
    apiClient.post('/api/auth/logout').then(r => r.data),
};
