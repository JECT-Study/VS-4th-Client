import { FIREBASE_VAPID_KEY, FIREBASE_WEB_APP_CONFIG } from "@base/push/firebaseWebConfig";
import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";

export const isFirebaseConfigured = (): boolean => true;

export const getFirebaseVapidKey = (): string => FIREBASE_VAPID_KEY;

export const getFirebaseApp = (): FirebaseApp => {
  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp(FIREBASE_WEB_APP_CONFIG);
};
