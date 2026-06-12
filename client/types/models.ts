import { UserRole, SessionStatus, VoteType, ActivityAction, TargetType } from './common';

// ─── User ───────────────────────────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Workspace ──────────────────────────────────────────────────────

export interface WorkspaceMember {
  user: User;
  role: UserRole;
  joinedAt: string;
}

export interface Workspace {
  _id: string;
  name: string;
  description?: string;
  owner: User;
  members: WorkspaceMember[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Board ──────────────────────────────────────────────────────────

export interface Board {
  _id: string;
  title: string;
  description?: string;
  workspace: string;
  createdBy: User;
  isArchived: boolean;
  archivedAt?: string;
  guestAccessEnabled?: boolean;
  shareToken?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Session ────────────────────────────────────────────────────────

export interface SessionSettings {
  allowAnonymous?: boolean;
  votingEnabled?: boolean;
  maxIdeasPerUser?: number;
}

export interface Session {
  _id: string;
  title: string;
  description?: string;
  board: string;
  workspace: string;
  facilitator: User;
  status: SessionStatus;
  settings: SessionSettings;
  maxParticipants?: number;
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Session Participant ────────────────────────────────────────────

export interface SessionParticipant {
  _id: string;
  session: string;
  user: User;
  joinedAt: string;
  leftAt?: string;
  isActive: boolean;
}

// ─── Idea ───────────────────────────────────────────────────────────

export interface Idea {
  _id: string;
  title: string;
  content?: string;
  session: string;
  author: User;
  parentIdea?: string;
  path: string;
  depth: number;
  position: number;
  tags?: string[];
  isDeleted: boolean;
  upvoteCount: number;
  downvoteCount: number;
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface IdeaNode extends Idea {
  children: IdeaNode[];
}

// ─── Idea Version ───────────────────────────────────────────────────

export interface IdeaVersion {
  _id: string;
  idea: string;
  version: number;
  title: string;
  content?: string;
  editedBy: User;
  changeNote?: string;
  createdAt: string;
}

// ─── Vote ───────────────────────────────────────────────────────────

export interface Vote {
  _id: string;
  idea: string;
  user: User;
  session: string;
  type: VoteType;
  weight: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Cluster ────────────────────────────────────────────────────────

export interface Cluster {
  _id: string;
  name: string;
  description?: string;
  session: string;
  ideas: Idea[];
  tags?: string[];
  color?: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

// ─── Activity Log ───────────────────────────────────────────────────

export interface ActivityLog {
  _id: string;
  session: string;
  user: User;
  action: ActivityAction;
  targetType: TargetType;
  targetId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ─── Session Analytics ──────────────────────────────────────────────

export interface SessionAnalytics {
  activeParticipants: number;
  totalParticipants: number;
  ideas: number;
  votes: number;
  activities: number;
}

// ─── Vote Analytics ─────────────────────────────────────────────────

export interface VoteAnalytics {
  totalVotes: number;
  votesByType: {
    upvotes: number;
    downvotes: number;
  };
  topIdeas: Array<{
    idea: Idea;
    totalVotes: number;
    upvotes: number;
    downvotes: number;
  }>;
}
