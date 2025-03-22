import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCkSf7YGbIpEs3EhtW_iTBBSbBQqZ2mfYY",
  authDomain: "barbernuevaa.firebaseapp.com",
  projectId: "barbernuevaa",
  storageBucket: "barbernuevaa.firebasestorage.app",
  messagingSenderId: "94523008032",
  appId: "1:94523008032:web:ea4ad0d2956de49d7b8845",
  measurementId: "G-TNR64B2J0T"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }; 