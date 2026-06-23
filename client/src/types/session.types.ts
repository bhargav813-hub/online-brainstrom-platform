export type SessionStatus = 'active' | 'paused' | 'ended';

export interface SessionSettings {
  anonymousIdeas?: boolean;
  allowVoting?: boolean;
  maxIdeasPerUser?: number;
  timeLimit?: number;
}

export interface SessionParticipant {
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  joinedAt: string;
  isActive: boolean;
}

export interface Session {
  _id: string;
  title: string;
  description?: string;
  board: string;
  workspace: string;
  facilitator: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  } | string;
  status: SessionStatus;
  settings?: SessionSettings;
  maxParticipants?: number;
  participants?: SessionParticipant[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionPayload {
  title: string;
  boardId: string;
  workspaceId: string;
  description?: string;
  maxParticipants?: number;
  settings?: SessionSettings;
}

export interface UpdateSessionPayload {
  title?: string;
  description?: string;
  status?: SessionStatus;
}

export interface SessionAnalytics {
  totalIdeas: number;
  totalVotes: number;
  totalParticipants: number;
  topIdeas: Array<{
    _id: string;
    title: string;
    upvoteCount: number;
    downvoteCount: number;
  }>;
  participantStats: Array<{
    user: { _id: string; name: string };
    ideaCount: number;
    voteCount: number;
  }>;
}
