import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { useAuthStore } from '@/store/auth.store';
import type { NormalizedError } from '@/types/api';

// ─── Axios Instance ─────────────────────────────────────────────────

const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Refresh Token Helpers ──────────────────────────────────────────

export function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('brainstorm_refresh_token');
}

export function storeRefreshToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('brainstorm_refresh_token', token);
}

export function clearStoredRefreshToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('brainstorm_refresh_token');
}

// ─── Request Interceptor ────────────────────────────────────────────

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor (Token Refresh) ───────────────────────────

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getStoredRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(
          `${env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`,
          { refreshToken }
        );

        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        useAuthStore.getState().setAccessToken(newAccessToken);
        storeRefreshToken(newRefreshToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        clearStoredRefreshToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Normalize error
    const responseData = error.response?.data as { message?: string; errors?: Array<{ field: string; message: string }> } | undefined;
    const apiError: NormalizedError = {
      message: responseData?.message ?? error.message,
      errors: responseData?.errors ?? [],
      status: error.response?.status ?? 0,
    };
    return Promise.reject(apiError);
  }
);

export default apiClient;
