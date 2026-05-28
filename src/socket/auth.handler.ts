import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { TokenPayload, ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '../types';

/**
 * Socket.IO Authentication Middleware
 * Verifies JWT token from the handshake auth object before allowing connection.
 */
export const socketAuthHandler = (
  io: SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication token is required'));
      }

      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;

      // Attach user data to socket
      socket.data.userId = decoded.id;
      socket.data.email = decoded.email;
      socket.data.role = decoded.role;

      logger.debug(`Socket authenticated: ${decoded.email}`);
      next();
    } catch (error) {
      logger.warn('Socket authentication failed:', error);
      next(new Error('Invalid or expired token'));
    }
  });
};
