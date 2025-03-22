"use client"

import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUserData, UserData } from '@/lib/auth'
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, User, Check, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { format, startOfWeek, addDays, subWeeks, addWeeks } from 'date-fns'
import { es } from 'date-fns/locale'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Icons } from '@/components/icons'

interface Appointment {
  id: string
  clientId: string
  clientName: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
]

export default function BarberDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [deleting, setDeleting] = useState(false)

  const weekDays = Array.from({ length: 6 }, (_, i) => addDays(currentWeek, i))

  const loadAppointments = async () => {
    try {
      const firebaseUser = await getCurrentUser()
      if (!firebaseUser) return

      const appointmentsQuery = query(
        collection(db, 'appointments'),
        where('barberId', '==', firebaseUser.uid)
      )
      const appointmentsSnapshot = await getDocs(appointmentsQuery)
      const appointmentsData = appointmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[]
      
      setAppointments(appointmentsData)
    } catch (error) {
      console.error('Error al cargar citas:', error)
      toast.error('Error al cargar las citas')
    }
  }

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
        await loadAppointments()
      } catch (error) {
        console.error('Error al cargar dashboard:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [router])

  const handleAppointmentAction = async (appointmentId: string, status: 'confirmed' | 'cancelled') => {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status,
        updatedAt: new Date().toISOString()
      })

      toast.success(status === 'confirmed' ? 'Cita confirmada' : 'Cita cancelada')
      loadAppointments()
    } catch (error) {
      console.error('Error al actualizar cita:', error)
      toast.error('Error al actualizar la cita')
    }
  }

  const getAppointmentForSlot = (date: Date, time: string) => {
    return appointments.find(
      app => app.date === format(date, 'yyyy-MM-dd') && app.time === time
    )
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(current => 
      direction === 'prev' ? subWeeks(current, 1) : addWeeks(current, 1)
    )
  }

  const handleDeleteDemoAppointments = async () => {
    try {
      setDeleting(true)
      const demoAppointments = appointments.filter(app => 
        app.clientName.toLowerCase().startsWith('cliente')
      )

      await Promise.all(
        demoAppointments.map(app => 
          deleteDoc(doc(db, 'appointments', app.id))
        )
      )

      toast.success('Citas de ejemplo eliminadas correctamente')
      loadAppointments()
    } catch (error) {
      console.error('Error al eliminar citas:', error)
      toast.error('Error al eliminar las citas de ejemplo')
    } finally {
      setDeleting(false)
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
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleDeleteDemoAppointments}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Eliminar Citas de Ejemplo
                </>
              )}
            </Button>
            <Button onClick={() => router.push('/barber/profile')}>
              <User className="mr-2 h-4 w-4" />
              Mi Perfil
            </Button>
          </div>
        </div>

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="calendar" className="flex-1">Agenda</TabsTrigger>
            <TabsTrigger value="appointments" className="flex-1">Citas Pendientes</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Agenda Semanal</CardTitle>
                    <CardDescription>
                      Semana del {format(currentWeek, "d 'de' MMMM", { locale: es })}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigateWeek('prev')}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigateWeek('next')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] w-full rounded-md border">
                  <div className="grid grid-cols-[80px_repeat(6,1fr)] gap-2 p-4">
                    <div className="font-medium sticky left-0 bg-background z-10">Hora</div>
                    {weekDays.map(day => (
                      <div key={day.toString()} className="font-medium text-center">
                        <div className="md:hidden">
                          {format(day, "EEE d", { locale: es })}
                        </div>
                        <div className="hidden md:block">
                          {format(day, "EEEE d", { locale: es })}
                        </div>
                      </div>
                    ))}

                    {timeSlots.map(time => (
                      <React.Fragment key={time}>
                        <div className="text-sm py-2 sticky left-0 bg-background z-10">{time}</div>
                        {weekDays.map(day => {
                          const appointment = getAppointmentForSlot(day, time)
                          return (
                            <div
                              key={`${day}-${time}`}
                              className={`text-sm p-1 rounded min-h-[40px] ${
                                appointment
                                  ? appointment.status === 'confirmed'
                                    ? 'bg-green-100'
                                    : appointment.status === 'pending'
                                    ? 'bg-yellow-100'
                                    : 'bg-gray-100'
                                  : 'border border-dashed'
                              }`}
                            >
                              {appointment && (
                                <div className="text-xs">
                                  {appointment.clientName}
                                  <br />
                                  <span className="text-muted-foreground">
                                    {appointment.status === 'pending' ? 'Pendiente' : 'Confirmada'}
                                  </span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Citas Pendientes</CardTitle>
                <CardDescription>
                  Gestiona las solicitudes de citas de tus clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments
                    .filter(app => app.status === 'pending')
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border gap-4"
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
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 flex-1 md:flex-none"
                            onClick={() => handleAppointmentAction(appointment.id, 'confirmed')}
                          >
                            <Check className="h-4 w-4 md:mr-2" />
                            <span className="hidden md:inline">Confirmar</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 flex-1 md:flex-none"
                            onClick={() => handleAppointmentAction(appointment.id, 'cancelled')}
                          >
                            <X className="h-4 w-4 md:mr-2" />
                            <span className="hidden md:inline">Cancelar</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  {appointments.filter(app => app.status === 'pending').length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      No hay citas pendientes
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

