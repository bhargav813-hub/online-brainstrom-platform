export const QUERY_CONFIG = {
  staleTime: {
    workspace: 5 * 60 * 1000,    // 5 min
    board: 5 * 60 * 1000,        // 5 min
    session: 1 * 60 * 1000,      // 1 min
    ideas: 0,                     // always fresh (socket keeps it current)
    voteAnalytics: 30 * 1000,    // 30 sec
    activity: 30 * 1000,         // 30 sec
  },
  gcTime: {
    workspace: 10 * 60 * 1000,   // 10 min
    board: 10 * 60 * 1000,       // 10 min
    session: 5 * 60 * 1000,      // 5 min
    ideas: 5 * 60 * 1000,        // 5 min
    voteAnalytics: 2 * 60 * 1000,// 2 min
    activity: 2 * 60 * 1000,     // 2 min
  },
  retry: 3,
  refetchOnWindowFocus: true,
} as const;
