export type ActivityAction =
  | 'idea_created'
  | 'idea_updated'
  | 'idea_deleted'
  | 'idea_moved'
  | 'vote_cast'
  | 'vote_removed'
  | 'cluster_created'
  | 'cluster_updated'
  | 'cluster_deleted'
  | 'session_started'
  | 'session_paused'
  | 'session_ended'
  | 'participant_joined'
  | 'participant_left';

export interface ActivityLog {
  _id: string;
  session: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  action: ActivityAction;
  details?: Record<string, unknown>;
  createdAt: string;
}
