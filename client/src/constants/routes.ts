export const ROUTES = {
  // Marketing
  HOME: '/',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Dashboard
  WORKSPACES: '/workspaces',
  WORKSPACE: (id: string) => `/workspaces/${id}` as const,
  WORKSPACE_SETTINGS: (id: string) => `/workspaces/${id}/settings` as const,
  BOARD: (workspaceId: string, boardId: string) =>
    `/workspaces/${workspaceId}/boards/${boardId}` as const,
  SESSION: (workspaceId: string, boardId: string, sessionId: string) =>
    `/workspaces/${workspaceId}/boards/${boardId}/sessions/${sessionId}` as const,
  PROFILE: '/profile',

  // Public
  SHARED_BOARD: (shareToken: string) => `/shared/${shareToken}` as const,
} as const;
