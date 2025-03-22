"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUserData, UserData } from '@/lib/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, User } from 'lucide-react'

interface Appointment {
  id: string
  clientId: string
  clientName: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

export default function BarberDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const firebaseUser = await getCurrentUser()
        if (!firebaseUser) {
          router.push('/login')
          return
        }

        const userData = await getUserData(firebaseUser.uid)
        if (!userData || userData.role !== 'barber') {
          router.push('/login')
          return
        }

        setUser(userData)

        // Cargar citas
        const appointmentsQuery = query(
          collection(db, 'appointments'),
          where('barberId', '==', firebaseUser.uid)
        )
        const appointmentsSnapshot = await getDocs(appointmentsQuery)
        const appointmentsData = appointmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Appointment[]
        
        // Ordenar citas por fecha y hora
        const sortedAppointments = appointmentsData.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`)
          const dateB = new Date(`${b.date} ${b.time}`)
          return dateA.getTime() - dateB.getTime()
        })
        
        setAppointments(sortedAppointments)
      } catch (error) {
        console.error('Error al cargar dashboard:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente'
      case 'confirmed':
        return 'Confirmada'
      case 'completed':
        return 'Completada'
      case 'cancelled':
        return 'Cancelada'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Cargando...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bienvenido, {user?.name}</h1>
            <p className="text-muted-foreground">
              Gestiona tus citas y perfil profesional
            </p>
          </div>
          <Button onClick={() => router.push('/barber/profile')}>
            <User className="mr-2 h-4 w-4" />
            Mi Perfil
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Agenda del Día</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p className="text-muted-foreground">No tienes citas programadas para hoy.</p>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{appointment.clientName}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-2 h-4 w-4" />
                          {appointment.date}
                          <Clock className="ml-4 mr-2 h-4 w-4" />
                          {appointment.time}
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {getStatusText(appointment.status)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

