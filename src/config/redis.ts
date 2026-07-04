import { createClient } from 'redis';
import { env } from './env';
import { logger } from './logger';

const redisClient = createClient({
  url: env.REDIS_URL
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

// Immediately connect
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    logger.error('Failed to connect to Redis on startup:', err);
  }
})();

export default redisClient;
