import { initializeApp } from "firebase/app";

// Firebase configuration for storage initialization
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
};

// Initialize Firebase app and get storage instance
export const app = initializeApp(firebaseConfig);

export default firebaseConfig;