"use client"

import { Calendar } from "@/components/ui/calendar"
import { useState, useEffect } from "react"
import { Filter, Search } from "lucide-react"
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUserData } from '@/lib/auth'
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db, Appointment, getBarberAppointments } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppointmentDetails } from "@/components/appointment-details"
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
import { Icons } from '@/components/icons'
import { Badge } from "@/components/ui/badge"

export default function AppointmentsPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming')
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  const loadAppointments = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) {
        router.push('/login')
        return
      }

      const appointmentsData = await getBarberAppointments(user.uid)
      setAppointments(appointmentsData)
    } catch (error) {
      console.error('Error al cargar citas:', error)
      toast.error('Error al cargar las citas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push('/login')
          return
        }

        const userData = await getUserData(user.uid)
        if (!userData || userData.role !== 'barber') {
          router.push('/login')
          return
        }

        loadAppointments()
      } catch (error) {
        console.error('Error al verificar autenticación:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

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

  const handleAppointmentUpdate = (updatedAppointment: Appointment) => {
    setAppointments(prev => 
      prev.map(app => 
        app.id === updatedAppointment.id ? updatedAppointment : app
      )
    )
  }

  const filteredAppointments = appointments
    .filter(app => {
      // Filtrar por término de búsqueda
      if (searchTerm && !app.clientName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Filtrar por fecha
      const appointmentDate = new Date(`${app.date} ${app.time}`)
      const now = new Date()

      if (filter === 'upcoming') {
        return appointmentDate >= now
      } else if (filter === 'past') {
        return appointmentDate < now
      }

      return true
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`)
      const dateB = new Date(`${b.date} ${b.time}`)
      return dateA.getTime() - dateB.getTime()
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Citas</h1>
            <p className="text-muted-foreground">
              Administra tus citas pendientes y pasadas
            </p>
          </div>
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
                <Icons.trash className="mr-2 h-4 w-4" />
                Eliminar Citas de Ejemplo
              </>
            )}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Input
              type="search"
              placeholder="Buscar por nombre de cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={filter} onValueChange={(value: 'all' | 'upcoming' | 'past') => setFilter(value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filtrar por fecha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las citas</SelectItem>
              <SelectItem value="upcoming">Próximas citas</SelectItem>
              <SelectItem value="past">Citas pasadas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader className="bg-primary/5">
            <CardTitle>Lista de Citas</CardTitle>
            <CardDescription>
              {filteredAppointments.length} citas encontradas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.clientName}</TableCell>
                    <TableCell>
                      {format(new Date(appointment.date), "d 'de' MMMM", { locale: es })}
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
                              : appointment.status === "completed"
                                ? "border-blue-500 text-blue-500"
                                : "border-red-500 text-red-500"
                        }
                      >
                        {appointment.status === "confirmed"
                          ? "Confirmada"
                          : appointment.status === "pending"
                            ? "Pendiente"
                            : appointment.status === "completed"
                              ? "Completada"
                              : "Cancelada"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        Ver detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {selectedAppointment && (
          <Card>
            <CardHeader className="bg-primary/5">
              <CardTitle>Detalles de la Cita</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <AppointmentDetails
                appointment={selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
                onUpdate={handleAppointmentUpdate}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

