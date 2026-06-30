import './lib/firebase'; // Initialize Firebase Admin
import { env } from './lib/env';
import app from './app';

const PORT = process.env.PORT || 4000;

async function start() {
  app.listen(PORT, () => {
    console.log(`[Server] Running on http://localhost:${PORT} (${env.NODE_ENV})`);
  });
}

start().catch((err) => {
  console.error('[Server] Failed to start:', err);
  process.exit(1);
});
