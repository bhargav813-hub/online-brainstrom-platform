import { PaginationMeta } from './common';

// ─── Standard Response Shapes ───────────────────────────────────────

export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: true;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiError {
  success: false;
  message: string;
  errors: Array<{ field: string; message: string }>;
}

// ─── Normalized Error (used in interceptor) ─────────────────────────

export interface NormalizedError {
  message: string;
  errors: Array<{ field: string; message: string }>;
  status: number;
}

// ─── Auth Responses ─────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: import('./models').User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: import('./models').User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
