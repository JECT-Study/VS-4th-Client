import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";

type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  messagingSenderId: string;
  appId: string;
  vapidKey: string;
};

/** Firebase Web 공개 설정 (FCM 푸시 토큰 발급용) */
const FIREBASE_WEB_CONFIG: FirebaseWebConfig = {
  apiKey: "AIzaSyBMubUnZcS6a7Ngpw5okF08SFx3GKGcm1Q",
  authDomain: "ject-vs-48246.firebaseapp.com",
  projectId: "ject-vs-48246",
  messagingSenderId: "712416945522",
  appId: "1:712416945522:web:dd8c372c87e48f7af9e9eb",
  vapidKey: "BMSJh_-zEZ2eWxd4rHbH0YswrljRgRgywRzI0VrGGrJgSQv-UaVaQr706lVaQVRJZkU56p38t-viprTtMauKI3w",
};

const readFirebaseWebConfig = (): FirebaseWebConfig => FIREBASE_WEB_CONFIG;

export const isFirebaseConfigured = (): boolean => true;

export const getFirebaseVapidKey = (): string => readFirebaseWebConfig().vapidKey;

export const getFirebaseApp = (): FirebaseApp => {
  if (getApps().length > 0) {
    return getApp();
  }

  const { vapidKey: _vapidKey, ...appConfig } = readFirebaseWebConfig();
  return initializeApp(appConfig);
};