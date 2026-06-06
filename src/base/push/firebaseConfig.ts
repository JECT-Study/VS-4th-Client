import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";

type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  messagingSenderId: string;
  appId: string;
  vapidKey: string;
};

const readFirebaseWebConfig = (): FirebaseWebConfig | null => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  const appId = import.meta.env.VITE_FIREBASE_APP_ID;
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

  if (!apiKey || !authDomain || !projectId || !messagingSenderId || !appId || !vapidKey) {
    return null;
  }

  return { apiKey, authDomain, projectId, messagingSenderId, appId, vapidKey };
};

export const isFirebaseConfigured = (): boolean => readFirebaseWebConfig() !== null;

export const getFirebaseVapidKey = (): string | null => readFirebaseWebConfig()?.vapidKey ?? null;

export const getFirebaseApp = (): FirebaseApp | null => {
  const config = readFirebaseWebConfig();
  if (!config) return null;

  if (getApps().length > 0) {
    return getApp();
  }

  const { vapidKey: _vapidKey, ...appConfig } = config;
  return initializeApp(appConfig);
};
