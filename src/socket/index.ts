import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { socketAuthHandler } from './auth.handler';
import { registerSessionHandlers } from './session.handler';
import { registerIdeaHandlers } from './idea.handler';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '../types';

/**
 * Initialize Socket.IO server with typed events.
 * Attaches auth middleware and registers all event handlers.
 */
export const initializeSocket = (httpServer: HttpServer) => {
  const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
    httpServer,
    {
      cors: {
        origin: env.CORS_ORIGIN,
        methods: ['GET', 'POST'],
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    }
  );

  // Apply JWT authentication middleware
  socketAuthHandler(io);

  // Handle new connections
  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.data.email} (${socket.id})`);

    // Register all event handlers
    registerSessionHandlers(io, socket);
    registerIdeaHandlers(io, socket);

    // Handle disconnection logging
    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${socket.data.email} (${reason})`);
    });
  });

  logger.info('Socket.IO server initialized');
  return io;
};
