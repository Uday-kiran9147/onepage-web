import Redis from 'ioredis';
import { env } from './env';

// Singleton Redis client — maxRetriesPerRequest: null required by BullMQ
export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redis.on('error', (err) => {
  console.error('[Redis] Connection error:', err.message);
});

redis.on('connect', () => {
  console.log('[Redis] Connected');
});
