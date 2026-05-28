import http from 'http';
import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';
import { initializeSocket } from './socket';
import { logger } from './config/logger';

/**
 * Server Entry Point
 * 1. Connects to MongoDB
 * 2. Creates HTTP server from Express app
 * 3. Initializes Socket.IO on the same server
 * 4. Starts listening for connections
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create HTTP server wrapping the Express app
    const httpServer = http.createServer(app);

    // Initialize Socket.IO on the HTTP server
    const io = initializeSocket(httpServer);

    // Make io accessible to route handlers if needed
    app.set('io', io);

    // Start listening
    httpServer.listen(env.PORT, () => {
      logger.info(`
  ╔════════════════════════════════════════════════════╗
  ║   Brainstorm Platform API Server                   ║
  ║   Environment: ${env.NODE_ENV.padEnd(35)}║
  ║   Port:        ${String(env.PORT).padEnd(35)}║
  ║   API:         http://localhost:${env.PORT}/api${' '.repeat(14)}║
  ║   Health:      http://localhost:${env.PORT}/api/health${' '.repeat(7)}║
  ║   WebSocket:   ws://localhost:${env.PORT}${' '.repeat(18)}║
  ╚════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      httpServer.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
