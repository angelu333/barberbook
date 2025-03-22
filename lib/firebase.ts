import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc, collection, DocumentData, query, where, getDocs } from 'firebase/firestore';
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
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export const defaultSchedule: WeeklySchedule = {
  monday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  tuesday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  wednesday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  thursday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  friday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  saturday: { enabled: true, ranges: [{ start: "10:00", end: "15:00" }] },
  sunday: { enabled: false, ranges: [{ start: "10:00", end: "15:00" }] }
};

// Función para obtener la referencia al horario de un barbero
export const getBarberScheduleRef = (barberId: string) => {
  return doc(db, 'barberSchedules', barberId);
};

// Función para escuchar cambios en el horario de un barbero
export const subscribeToBarberSchedule = (barberId: string, callback: (schedule: WeeklySchedule | null) => void) => {
  const unsubscribe = onSnapshot(
    doc(db, 'barberSchedules', barberId),
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() as DocumentData;
        // Verificar que el documento tenga la estructura correcta
        const isValidSchedule = validateScheduleStructure(data);
        if (isValidSchedule) {
          callback(data as WeeklySchedule);
        } else {
          console.error('Estructura de horario inválida');
          callback(null);
        }
      } else {
        // Si no existe el documento, crear uno con el horario por defecto
        setDoc(doc.ref, defaultSchedule)
          .then(() => callback(defaultSchedule))
          .catch((error) => {
            console.error('Error al crear horario por defecto:', error);
            callback(null);
          });
      }
    },
    (error) => {
      console.error('Error al suscribirse a horario:', error);
      callback(null);
    }
  );

  return unsubscribe;
};

// Función para actualizar el horario de un barbero
export const updateBarberSchedule = async (barberId: string, schedule: WeeklySchedule) => {
  if (!validateScheduleStructure(schedule)) {
    throw new Error('Estructura de horario inválida');
  }
  
  const scheduleRef = getBarberScheduleRef(barberId);
  await setDoc(scheduleRef, schedule);
};

// Función para validar la estructura del horario
const validateScheduleStructure = (data: any): data is WeeklySchedule => {
  if (!data) return false;

  const requiredDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  return requiredDays.every(day => {
    if (!data[day]) return false;
    if (typeof data[day].enabled !== 'boolean') return false;
    if (!Array.isArray(data[day].ranges)) return false;
    
    return data[day].ranges.every((range: any) => {
      if (!range.start || !range.end) return false;
      if (typeof range.start !== 'string' || typeof range.end !== 'string') return false;
      
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      return timeRegex.test(range.start) && timeRegex.test(range.end);
    });
  });
};

export { app, auth, db, storage };

// Interfaces para citas
export interface Appointment {
  id: string;
  barberId: string;
  barberName: string;
  clientId: string;
  clientName: string;
  clientPhone?: string;
  date: string;
  time: string;
  duration: number;
  service?: string;
  price?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

// Funciones para manejar citas
export const getAppointmentsRef = () => {
  return collection(db, 'appointments');
};

export const getBarberAppointments = async (barberId: string): Promise<Appointment[]> => {
  try {
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('barberId', '==', barberId)
    );
    const appointmentsSnapshot = await getDocs(appointmentsQuery);
    return appointmentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Appointment[];
  } catch (error) {
    console.error('Error al obtener citas:', error);
    throw error;
  }
};

export const updateAppointmentStatus = async (appointmentId: string, status: Appointment['status']) => {
  try {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await setDoc(appointmentRef, { status }, { merge: true });
  } catch (error) {
    console.error('Error al actualizar estado de cita:', error);
    throw error;
  }
}; 