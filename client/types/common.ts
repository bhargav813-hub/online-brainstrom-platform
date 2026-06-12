// ─── Enums (exact values from backend) ──────────────────────────────

export type UserRole = 'participant' | 'facilitator' | 'reviewer' | 'workspace_admin';

export type SessionStatus = 'active' | 'paused' | 'ended';

export type VoteType = 'upvote' | 'downvote';

export type ActivityAction =
  | 'idea_created' | 'idea_updated' | 'idea_deleted' | 'idea_moved' | 'idea_restored'
  | 'vote_cast' | 'vote_removed'
  | 'session_started' | 'session_paused' | 'session_ended'
  | 'user_joined' | 'user_left'
  | 'cluster_created' | 'cluster_updated' | 'cluster_deleted'
  | 'board_created' | 'board_archived';

export type NotificationType =
  | 'session_invite' | 'idea_reply' | 'vote_received' | 'role_changed'
  | 'session_started' | 'mention';

export type TargetType = 'idea' | 'session' | 'board' | 'cluster' | 'vote' | 'user';

// ─── Pagination ─────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
