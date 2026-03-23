import { getApp, getApps, initializeApp } from "firebase/app";
// @ts-ignore – getReactNativePersistence exists in the RN bundle but TS resolves to web types
import {
  getAuth,
  // getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const isFirstInit = getApps().length === 0;
const app = isFirstInit ? initializeApp(firebaseConfig) : getApp();

// initializeAuth must only be called once; on hot reload use getAuth
const auth = isFirstInit
  ? initializeAuth(app, {
      // persistence: getReactNativePersistence(AsyncStorage),
    })
  : getAuth(app);

const db = getFirestore(app);

export { app, auth, db };
