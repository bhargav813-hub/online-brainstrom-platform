import { Server as SocketIOServer, Socket } from 'socket.io';
import { IdeaService } from '../modules/ideas/idea.service';
import { VoteService } from '../modules/votes/vote.service';
import { logger } from '../config/logger';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '../types';

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type TypedIO = SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

/**
 * Idea Socket Handlers
 * Real-time CRUD operations on ideas, broadcast to all session participants.
 */
export const registerIdeaHandlers = (io: TypedIO, socket: TypedSocket) => {
  /**
   * Handle real-time idea creation.
   * Creates the idea via service and broadcasts to the session room.
   */
  socket.on('idea:create', async (data) => {
    try {
      const idea = await IdeaService.create(
        {
          title: data.title,
          content: data.content,
          sessionId: data.sessionId,
          parentIdeaId: data.parentIdea,
        },
        socket.data.userId
      );

      // Broadcast to all participants in the session
      io.to(`session:${data.sessionId}`).emit('idea:created', idea);

      logger.debug(`Idea created via socket: ${idea.title}`);
    } catch (error: any) {
      logger.error('Error in idea:create handler:', error);
      socket.emit('error', { message: error.message || 'Failed to create idea' });
    }
  });

  /**
   * Handle real-time idea update.
   */
  socket.on('idea:update', async (data) => {
    try {
      const idea = await IdeaService.update(
        data.ideaId,
        { title: data.title, content: data.content },
        socket.data.userId
      );

      if (idea) {
        // Find which session room this idea belongs to
        const sessionId = (idea as any).session.toString();
        io.to(`session:${sessionId}`).emit('idea:updated', idea);
      }
    } catch (error: any) {
      logger.error('Error in idea:update handler:', error);
      socket.emit('error', { message: error.message || 'Failed to update idea' });
    }
  });

  /**
   * Handle real-time idea deletion.
   */
  socket.on('idea:delete', async (data) => {
    try {
      const idea = await IdeaService.delete(data.ideaId, socket.data.userId);

      const sessionId = (idea as any).session.toString();
      io.to(`session:${sessionId}`).emit('idea:deleted', { ideaId: data.ideaId });
    } catch (error: any) {
      logger.error('Error in idea:delete handler:', error);
      socket.emit('error', { message: error.message || 'Failed to delete idea' });
    }
  });

  /**
   * Handle real-time idea move in the tree.
   */
  socket.on('idea:move', async (data) => {
    try {
      const idea = await IdeaService.move(data.ideaId, data.newParentId, socket.data.userId);

      const sessionId = (idea as any).session.toString();
      io.to(`session:${sessionId}`).emit('idea:moved', idea);
    } catch (error: any) {
      logger.error('Error in idea:move handler:', error);
      socket.emit('error', { message: error.message || 'Failed to move idea' });
    }
  });

  /**
   * Handle real-time vote casting.
   */
  socket.on('vote:cast', async (data) => {
    try {
      const { Idea } = await import('../modules/ideas/idea.model');
      const idea = await Idea.findById(data.ideaId);
      if (!idea) return;

      const sessionId = idea.session.toString();
      const vote = await VoteService.castVote(
        { ideaId: data.ideaId, sessionId, type: data.type, weight: data.weight },
        socket.data.userId
      );

      // Broadcast updated vote to all session participants
      const updatedIdea = await Idea.findById(data.ideaId).select('upvoteCount downvoteCount');
      io.to(`session:${sessionId}`).emit('vote:cast', {
        ideaId: data.ideaId,
        vote,
        upvoteCount: updatedIdea?.upvoteCount,
        downvoteCount: updatedIdea?.downvoteCount,
      });
    } catch (error: any) {
      logger.error('Error in vote:cast handler:', error);
      socket.emit('error', { message: error.message || 'Failed to cast vote' });
    }
  });
};
