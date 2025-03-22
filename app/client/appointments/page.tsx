'use client'

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db, Appointment } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import { Badge } from "@/components/ui/badge"
import { Icons } from '@/components/icons'

export default function MyAppointmentsPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAppointments() {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push('/login')
          return
        }

        const appointmentsQuery = query(
          collection(db, 'appointments'),
          where('clientId', '==', user.uid)
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
      } finally {
        setLoading(false)
      }
    }

    loadAppointments()
  }, [router])

  const now = new Date()
  const upcomingAppointments = appointments
    .filter(app => {
      const appointmentDate = new Date(`${app.date} ${app.time}`)
      return appointmentDate >= now
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`)
      const dateB = new Date(`${b.date} ${b.time}`)
      return dateA.getTime() - dateB.getTime()
    })

  const pastAppointments = appointments
    .filter(app => {
      const appointmentDate = new Date(`${app.date} ${app.time}`)
      return appointmentDate < now
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`)
      const dateB = new Date(`${b.date} ${b.time}`)
      return dateB.getTime() - dateA.getTime() // Orden descendente para citas pasadas
    })

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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mis Citas</h1>
          <p className="text-muted-foreground">
            Gestiona tus citas programadas
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Próximas Citas</TabsTrigger>
            <TabsTrigger value="past">Citas Pasadas</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Próximas Citas</CardTitle>
                <CardDescription>
                  {upcomingAppointments.length} citas programadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No tienes citas programadas
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Barbero</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>{appointment.barberName}</TableCell>
                          <TableCell>
                            {format(new Date(appointment.date), "EEEE d 'de' MMMM", { locale: es })}
                          </TableCell>
                          <TableCell>{appointment.time}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                appointment.status === "confirmed"
                                  ? "border-green-500 text-green-500"
                                  : appointment.status === "pending"
                                    ? "border-yellow-500 text-yellow-500"
                                    : "border-red-500 text-red-500"
                              }
                            >
                              {appointment.status === "confirmed"
                                ? "Confirmada"
                                : appointment.status === "pending"
                                  ? "Pendiente"
                                  : "Cancelada"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="past">
            <Card>
              <CardHeader>
                <CardTitle>Citas Pasadas</CardTitle>
                <CardDescription>
                  {pastAppointments.length} citas anteriores
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pastAppointments.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No tienes citas pasadas
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Barbero</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>{appointment.barberName}</TableCell>
                          <TableCell>
                            {format(new Date(appointment.date), "EEEE d 'de' MMMM", { locale: es })}
                          </TableCell>
                          <TableCell>{appointment.time}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                appointment.status === "completed"
                                  ? "border-blue-500 text-blue-500"
                                  : "border-red-500 text-red-500"
                              }
                            >
                              {appointment.status === "completed"
                                ? "Completada"
                                : "Cancelada"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 