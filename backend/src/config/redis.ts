import { createClient, RedisClientType } from 'redis';
import { config } from './index';
import { logger } from '../utils/logger';

const redisClient: RedisClientType = createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
  password: config.redis.password || undefined,
  database: config.redis.db,
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

redisClient.on('disconnect', () => {
  logger.warn('Redis client disconnected');
});

export async function connectRedis(): Promise<void> {
  try {
    await redisClient.connect();
    logger.info('Redis connection established');
  } catch (error) {
    logger.error('Failed to connect to Redis', error);
    throw error;
  }
}

export async function disconnectRedis(): Promise<void> {
  try {
    await redisClient.quit();
    logger.info('Redis connection closed');
  } catch (error) {
    logger.error('Error closing Redis connection', error);
  }
}

export async function get(key: string): Promise<string | null> {
  try {
    return await redisClient.get(key);
  } catch (error) {
    logger.error('Redis GET error', { key, error });
    throw error;
  }
}

export async function set(key: string, value: string, expiry?: number): Promise<void> {
  try {
    if (expiry) {
      await redisClient.setEx(key, expiry, value);
    } else {
      await redisClient.set(key, value);
    }
  } catch (error) {
    logger.error('Redis SET error', { key, error });
    throw error;
  }
}

export async function del(key: string): Promise<number> {
  try {
    return await redisClient.del(key);
  } catch (error) {
    logger.error('Redis DEL error', { key, error });
    throw error;
  }
}

export async function exists(key: string): Promise<number> {
  try {
    return await redisClient.exists(key);
  } catch (error) {
    logger.error('Redis EXISTS error', { key, error });
    throw error;
  }
}

export async function expire(key: string, seconds: number): Promise<boolean> {
  try {
    return await redisClient.expire(key, seconds);
  } catch (error) {
    logger.error('Redis EXPIRE error', { key, error });
    throw error;
  }
}

export { redisClient };
