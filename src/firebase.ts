import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { env } from '@/env';

const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
