export const ROUTES = {
  // Marketing
  HOME: '/',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',

  // Dashboard
  DASHBOARD: '/workspaces',
  PROFILE: '/profile',

  // Workspaces
  WORKSPACES: '/workspaces',
  WORKSPACE_NEW: '/workspaces/new',
  WORKSPACE_DETAIL: (id: string) => `/workspaces/${id}` as const,
  WORKSPACE_SETTINGS: (id: string) => `/workspaces/${id}/settings` as const,
  WORKSPACE_MEMBERS: (id: string) => `/workspaces/${id}/members` as const,

  // Boards
  BOARD_NEW: (workspaceId: string) => `/workspaces/${workspaceId}/boards/new` as const,
  BOARD_DETAIL: (workspaceId: string, boardId: string) =>
    `/workspaces/${workspaceId}/boards/${boardId}` as const,

  // Sessions
  SESSION_NEW: (workspaceId: string, boardId: string) =>
    `/workspaces/${workspaceId}/boards/${boardId}/sessions/new` as const,
  SESSION_DETAIL: (workspaceId: string, boardId: string, sessionId: string) =>
    `/workspaces/${workspaceId}/boards/${boardId}/sessions/${sessionId}` as const,
  SESSION_ANALYTICS: (workspaceId: string, boardId: string, sessionId: string) =>
    `/workspaces/${workspaceId}/boards/${boardId}/sessions/${sessionId}/analytics` as const,
  SESSION_ACTIVITY: (workspaceId: string, boardId: string, sessionId: string) =>
    `/workspaces/${workspaceId}/boards/${boardId}/sessions/${sessionId}/activity` as const,
} as const;
