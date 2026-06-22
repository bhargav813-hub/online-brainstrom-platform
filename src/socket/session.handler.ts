import { Server as SocketIOServer, Socket } from 'socket.io';
import { SessionParticipant } from '../modules/sessions/sessionParticipant.model';
import { Session } from '../modules/sessions/session.model';
import { Workspace } from '../modules/workspaces/workspace.model';
import { logger } from '../config/logger';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '../types';

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type TypedIO = SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

/**
 * Session Socket Handlers
 * Manages session join/leave events and participant presence broadcasting.
 */
export const registerSessionHandlers = (io: TypedIO, socket: TypedSocket) => {
  /**
   * Handle user joining a brainstorming session room.
   * Updates participant record and broadcasts updated participant list.
   */
  socket.on('session:join', async (data) => {
    try {
      const { sessionId } = data;
      const roomName = `session:${sessionId}`;

      // Check session exists
      const session = await Session.findById(sessionId);
      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      // Check if user is a member of the workspace the session belongs to
      const workspace = await Workspace.findById(session.workspace);
      if (!workspace) {
        socket.emit('error', { message: 'Workspace not found' });
        return;
      }

      const isMember =
        workspace.owner.toString() === socket.data.userId ||
        workspace.members.some((m) => m.user.toString() === socket.data.userId);

      if (!isMember) {
        socket.emit('error', { message: 'Forbidden: You are not a member of this workspace' });
        return;
      }

      // Join the Socket.IO room
      socket.join(roomName);

      // Update or create participant record
      let participant = await SessionParticipant.findOne({
        session: sessionId,
        user: socket.data.userId,
      });

      if (participant) {
        participant.isActive = true;
        participant.joinedAt = new Date();
        participant.leftAt = undefined;
        await participant.save();
      } else {
        participant = await SessionParticipant.create({
          session: sessionId,
          user: socket.data.userId,
          isActive: true,
        });
      }

      // Broadcast updated participant list to the room
      const participants = await SessionParticipant.find({
        session: sessionId,
        isActive: true,
      }).populate('user', 'name email avatar');

      io.to(roomName).emit('session:participants', {
        participants: participants.map((p) => ({
          userId: p.user,
          joinedAt: p.joinedAt,
        })),
      });

      logger.info(`User ${socket.data.email} joined session ${sessionId}`);
    } catch (error) {
      logger.error('Error in session:join handler:', error);
      socket.emit('error', { message: 'Failed to join session' });
    }
  });

  /**
   * Handle user leaving a session room.
   */
  socket.on('session:leave', async (data) => {
    try {
      const { sessionId } = data;
      const roomName = `session:${sessionId}`;

      socket.leave(roomName);

      // Mark participant as inactive
      await SessionParticipant.findOneAndUpdate(
        { session: sessionId, user: socket.data.userId },
        { isActive: false, leftAt: new Date() }
      );

      // Broadcast updated participant list
      const participants = await SessionParticipant.find({
        session: sessionId,
        isActive: true,
      }).populate('user', 'name email avatar');

      io.to(roomName).emit('session:participants', {
        participants: participants.map((p) => ({
          userId: p.user,
          joinedAt: p.joinedAt,
        })),
      });

      logger.info(`User ${socket.data.email} left session ${sessionId}`);
    } catch (error) {
      logger.error('Error in session:leave handler:', error);
    }
  });

  /**
   * Handle socket disconnect — mark all session participations as inactive.
   */
  socket.on('disconnect', async () => {
    try {
      // Find all active sessions the user is currently in before updating
      const activeParticipations = await SessionParticipant.find({
        user: socket.data.userId,
        isActive: true,
      });

      const updated = await SessionParticipant.updateMany(
        { user: socket.data.userId, isActive: true },
        { isActive: false, leftAt: new Date() }
      );

      // Notify each session room
      for (const participation of activeParticipations) {
        const roomName = `session:${participation.session}`;
        
        const remainingParticipants = await SessionParticipant.find({
          session: participation.session,
          isActive: true,
        }).populate('user', 'name email avatar');

        io.to(roomName).emit('session:participants', {
          participants: remainingParticipants.map((p) => ({
            userId: p.user,
            joinedAt: p.joinedAt,
          })),
        });
      }

      logger.info(`User ${socket.data.email} disconnected. Updated ${updated.modifiedCount} sessions and notified remaining participants.`);
    } catch (error) {
      logger.error('Error on socket disconnect:', error);
    }
  });
};
