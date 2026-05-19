import mongoose from 'mongoose';
import { env } from '../lib/env';

// Import workers to start them
import './moderation.worker';
import './clustering.worker';

async function startWorkers() {
  console.log('[Workers] Connecting to MongoDB...');
  await mongoose.connect(env.MONGODB_URI);
  console.log('[Workers] MongoDB connected');
  console.log('[Workers] Moderation + Clustering workers started');
}

startWorkers().catch((err) => {
  console.error('[Workers] Failed to start:', err);
  process.exit(1);
});
