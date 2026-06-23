export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  users: {
    search: (q: string) => ['users', 'search', q] as const,
  },
  workspaces: {
    all: ['workspaces'] as const,
    detail: (id: string) => ['workspaces', id] as const,
  },
  boards: {
    byWorkspace: (workspaceId: string) => ['boards', 'workspace', workspaceId] as const,
    detail: (id: string) => ['boards', id] as const,
    shared: (shareToken: string) => ['boards', 'shared', shareToken] as const,
  },
  sessions: {
    byBoard: (boardId: string) => ['sessions', 'board', boardId] as const,
    detail: (id: string) => ['sessions', id] as const,
    analytics: (id: string) => ['sessions', id, 'analytics'] as const,
  },
  ideas: {
    hierarchy: (sessionId: string) => ['ideas', 'hierarchy', sessionId] as const,
    children: (ideaId: string) => ['ideas', ideaId, 'children'] as const,
    search: (sessionId: string, q: string) => ['ideas', 'search', sessionId, q] as const,
    versions: (ideaId: string) => ['ideas', ideaId, 'versions'] as const,
  },
  votes: {
    byIdea: (ideaId: string) => ['votes', 'idea', ideaId] as const,
    analytics: (sessionId: string) => ['votes', 'analytics', sessionId] as const,
  },
  clusters: {
    bySession: (sessionId: string) => ['clusters', 'session', sessionId] as const,
  },
  activity: {
    bySession: (sessionId: string) => ['activity', 'session', sessionId] as const,
    filtered: (sessionId: string, action: string) =>
      ['activity', 'session', sessionId, 'filter', action] as const,
    byUser: (sessionId: string, userId: string) =>
      ['activity', 'session', sessionId, 'user', userId] as const,
  },
} as const;
