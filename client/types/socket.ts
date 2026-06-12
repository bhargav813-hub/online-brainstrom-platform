import { Idea, Vote, SessionParticipant } from './models';
import { ActivityAction, SessionStatus } from './common';

// ─── Socket Event Payloads (Client → Server) ───────────────────────

export interface JoinSessionPayload {
  sessionId: string;
}

export interface LeaveSessionPayload {
  sessionId: string;
}

// ─── Socket Event Payloads (Server → Client) ───────────────────────

export interface IdeaCreatedEvent {
  idea: Idea;
  sessionId: string;
}

export interface IdeaUpdatedEvent {
  idea: Idea;
  sessionId: string;
}

export interface IdeaDeletedEvent {
  ideaId: string;
  sessionId: string;
}

export interface IdeaMovedEvent {
  idea: Idea;
  sessionId: string;
}

export interface VoteCastEvent {
  vote: Vote;
  ideaId: string;
  sessionId: string;
  upvoteCount: number;
  downvoteCount: number;
}

export interface VoteRemovedEvent {
  ideaId: string;
  sessionId: string;
  upvoteCount: number;
  downvoteCount: number;
}

export interface SessionStatusChangedEvent {
  sessionId: string;
  status: SessionStatus;
}

export interface ParticipantJoinedEvent {
  participant: SessionParticipant;
  sessionId: string;
}

export interface ParticipantLeftEvent {
  userId: string;
  sessionId: string;
}

export interface SessionParticipantsEvent {
  sessionId: string;
  participants: SessionParticipant[];
}

// ─── Socket Event Map ───────────────────────────────────────────────

export interface ServerToClientEvents {
  'idea:created': (data: IdeaCreatedEvent) => void;
  'idea:updated': (data: IdeaUpdatedEvent) => void;
  'idea:deleted': (data: IdeaDeletedEvent) => void;
  'idea:moved': (data: IdeaMovedEvent) => void;
  'vote:cast': (data: VoteCastEvent) => void;
  'vote:removed': (data: VoteRemovedEvent) => void;
  'session:status': (data: SessionStatusChangedEvent) => void;
  'session:participants': (data: SessionParticipantsEvent) => void;
  'participant:joined': (data: ParticipantJoinedEvent) => void;
  'participant:left': (data: ParticipantLeftEvent) => void;
}

export interface ClientToServerEvents {
  'session:join': (data: JoinSessionPayload) => void;
  'session:leave': (data: LeaveSessionPayload) => void;
}
