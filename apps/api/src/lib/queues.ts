import { Queue } from 'bullmq';
import { redis } from '../lib/redis';

export const moderationQueue = new Queue('moderation', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: { count: 5 },
  },
});

export const clusteringQueue = new Queue('clustering', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: { count: 3 },
  },
});
