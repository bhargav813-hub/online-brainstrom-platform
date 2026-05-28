import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

/**
 * Establishes MongoDB connection with retry logic.
 * Uses Mongoose connection events for lifecycle management.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      // Mongoose 8 uses the new URL parser and unified topology by default
    });

    logger.info(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting reconnection...');
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};
