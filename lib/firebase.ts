import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc, collection } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Verificar que todas las variables de entorno necesarias estén definidas
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
  }
}

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Funciones para manejar horarios
export interface TimeRange {
  start: string;
  end: string;
}

export interface DaySchedule {
  enabled: boolean;
  ranges: TimeRange[];
}

export interface WeeklySchedule {
  [key: string]: DaySchedule;
}

// Función para obtener la referencia al horario de un barbero
export const getBarberScheduleRef = (barberId: string) => {
  return doc(db, 'barberSchedules', barberId);
};

// Función para escuchar cambios en el horario de un barbero
export const subscribeToBarberSchedule = (barberId: string, callback: (schedule: WeeklySchedule | null) => void) => {
  return onSnapshot(doc(db, 'barberSchedules', barberId), (doc) => {
    if (doc.exists()) {
      callback(doc.data() as WeeklySchedule);
    } else {
      callback(null);
    }
  });
};

// Función para actualizar el horario de un barbero
export const updateBarberSchedule = async (barberId: string, schedule: WeeklySchedule) => {
  const scheduleRef = getBarberScheduleRef(barberId);
  await setDoc(scheduleRef, schedule, { merge: true });
};

export { app, auth, db, storage }; 