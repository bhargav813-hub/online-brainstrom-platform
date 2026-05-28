import { Request } from 'express';
import mongoose from 'mongoose';

/**
 * Global type definitions for the application.
 */

// ==================== ENUMS ====================

export enum UserRole {
  PARTICIPANT = 'participant',
  FACILITATOR = 'facilitator',
  REVIEWER = 'reviewer',
  WORKSPACE_ADMIN = 'workspace_admin',
}

export enum SessionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  ENDED = 'ended',
}

export enum VoteType {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote',
}

export enum ActivityAction {
  IDEA_CREATED = 'idea_created',
  IDEA_UPDATED = 'idea_updated',
  IDEA_DELETED = 'idea_deleted',
  IDEA_MOVED = 'idea_moved',
  IDEA_RESTORED = 'idea_restored',
  VOTE_CAST = 'vote_cast',
  VOTE_REMOVED = 'vote_removed',
  SESSION_STARTED = 'session_started',
  SESSION_PAUSED = 'session_paused',
  SESSION_ENDED = 'session_ended',
  USER_JOINED = 'user_joined',
  USER_LEFT = 'user_left',
  CLUSTER_CREATED = 'cluster_created',
  CLUSTER_UPDATED = 'cluster_updated',
  CLUSTER_DELETED = 'cluster_deleted',
  BOARD_CREATED = 'board_created',
  BOARD_ARCHIVED = 'board_archived',
}

export enum NotificationType {
  SESSION_INVITE = 'session_invite',
  IDEA_REPLY = 'idea_reply',
  VOTE_RECEIVED = 'vote_received',
  ROLE_CHANGED = 'role_changed',
  SESSION_STARTED = 'session_started',
  MENTION = 'mention',
}

// ==================== INTERFACES ====================

/** Extends Express Request with authenticated user info */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

/** Workspace member with role */
export interface WorkspaceMember {
  user: mongoose.Types.ObjectId;
  role: UserRole;
  joinedAt: Date;
}

/** JWT Token payload */
export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
}

/** Socket.IO typed events */
export interface ServerToClientEvents {
  'session:participants': (data: { participants: any[] }) => void;
  'idea:created': (data: any) => void;
  'idea:updated': (data: any) => void;
  'idea:deleted': (data: { ideaId: string }) => void;
  'idea:moved': (data: any) => void;
  'vote:cast': (data: any) => void;
  'vote:removed': (data: any) => void;
  'cluster:updated': (data: any) => void;
  'notification:new': (data: any) => void;
  'session:statusChanged': (data: { status: SessionStatus }) => void;
  'error': (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  'session:join': (data: { sessionId: string }) => void;
  'session:leave': (data: { sessionId: string }) => void;
  'idea:create': (data: { title: string; content: string; parentIdea?: string; sessionId: string }) => void;
  'idea:update': (data: { ideaId: string; title?: string; content?: string }) => void;
  'idea:delete': (data: { ideaId: string }) => void;
  'idea:move': (data: { ideaId: string; newParentId: string | null }) => void;
  'vote:cast': (data: { ideaId: string; type: VoteType; weight?: number }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  email: string;
  role: UserRole;
}
