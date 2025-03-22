import { PrismaClient } from '@prisma/client'
import { db } from './firebase'
import { collection, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 

export async function createAppointment(data: any) {
  try {
    const appointmentRef = await addDoc(collection(db, 'appointments'), {
      ...data,
      createdAt: new Date().toISOString(),
      status: 'pending'
    })
    return appointmentRef.id
  } catch (error) {
    console.error('Error al crear la cita:', error)
    throw error
  }
}

export async function deleteAllAppointments() {
  try {
    const appointmentsRef = collection(db, 'appointments')
    const querySnapshot = await getDocs(appointmentsRef)
    
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref))
    await Promise.all(deletePromises)
    
    return true
  } catch (error) {
    console.error('Error al eliminar las citas:', error)
    throw error
  }
} 