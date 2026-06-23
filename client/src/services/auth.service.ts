import apiClient from './api-client';
import type { ApiResponse } from '@/types/api.types';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '@/types/auth.types';

export const authService = {
  register: async (payload: RegisterPayload) => {
    const { data } = await apiClient.post<ApiResponse<null>>('/auth/register', payload);
    return data;
  },

  verifyOtp: async (payload: VerifyOtpPayload) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/verify-otp', payload);
    return data.data;
  },

  login: async (payload: LoginPayload) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload);
    return data.data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const { data } = await apiClient.post<ApiResponse<null>>('/auth/forgot-password', payload);
    return data;
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    const { data } = await apiClient.post<ApiResponse<null>>('/auth/reset-password', payload);
    return data;
  },

  refreshToken: async (refreshToken: string) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh-token', {
      refreshToken,
    });
    return data.data;
  },

  logout: async () => {
    const { data } = await apiClient.post<ApiResponse<null>>('/auth/logout');
    return data;
  },
};
