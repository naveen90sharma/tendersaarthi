import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "") + ".firebasestorage.app",
};

// Initialize Firebase only if we have an API key to avoid build-time crashes
const app = (process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
    ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig))
    : null;

export const auth = app ? getAuth(app) : null;
