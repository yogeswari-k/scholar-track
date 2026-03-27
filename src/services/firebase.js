// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 🔧 Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyAvuj5aJVghn6zrpl5ZjP609FiV6tEioc4",
  authDomain: "scholar-track-8ec9c.firebaseapp.com",
  projectId: "scholar-track-8ec9c",
  storageBucket: "scholar-track-8ec9c.firebasestorage.app",
  messagingSenderId: "553139035806",
  appId: "1:553139035806:web:992401d7efc3b435d8e58f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
