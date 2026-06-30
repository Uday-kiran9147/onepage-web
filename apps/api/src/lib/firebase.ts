import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Transaction, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { env } from './env';

const projectId = env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'readonepage-local';

if (getApps().length === 0) {
  if (env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log('[Firebase] Initialized with Service Account cert');
  } else {
    // Fallback for local development/emulator or environment default
    initializeApp({
      projectId,
    });
    console.log('[Firebase] Initialized with Project ID:', projectId);
  }
}

export const db = getFirestore();
export const auth = getAuth();
export { Transaction, QueryDocumentSnapshot };
