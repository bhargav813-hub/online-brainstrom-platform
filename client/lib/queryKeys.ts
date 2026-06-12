export const queryKeys = {
  // Auth
  auth: {
    me: ['auth', 'me'] as const,
  },

  // Users
  users: {
    search: (q: string) => ['users', 'search', q] as const,
  },

  // Workspaces
  workspaces: {
    all: ['workspaces'] as const,
    detail: (id: string) => ['workspaces', id] as const,
  },

  // Boards
  boards: {
    byWorkspace: (workspaceId: string) => ['boards', workspaceId] as const,
    detail: (id: string) => ['boards', 'detail', id] as const,
  },

  // Sessions
  sessions: {
    byBoard: (boardId: string) => ['sessions', boardId] as const,
    detail: (id: string) => ['sessions', 'detail', id] as const,
    analytics: (id: string) => ['sessions', 'analytics', id] as const,
  },

  // Ideas
  ideas: {
    hierarchy: (sessionId: string) => ['ideas', 'hierarchy', sessionId] as const,
    children: (ideaId: string) => ['ideas', 'children', ideaId] as const,
    search: (sessionId: string, q: string) => ['ideas', 'search', sessionId, q] as const,
    versions: (ideaId: string) => ['ideas', 'versions', ideaId] as const,
  },

  // Votes
  votes: {
    analytics: (sessionId: string) => ['votes', 'analytics', sessionId] as const,
    byIdea: (ideaId: string) => ['votes', 'idea', ideaId] as const,
    myVotes: (sessionId: string) => ['votes', 'my-votes', sessionId] as const,
  },

  // Clusters
  clusters: {
    bySession: (sessionId: string) => ['clusters', sessionId] as const,
  },

  // Activity
  activity: {
    bySession: (sessionId: string) => ['activity', sessionId] as const,
    filtered: (sessionId: string, action: string) => ['activity', sessionId, 'filter', action] as const,
    byUser: (sessionId: string, userId: string) => ['activity', sessionId, 'user', userId] as const,
  },
} as const;
