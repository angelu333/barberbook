"use client"

import { Calendar } from "@/components/ui/calendar"

import { useState, useEffect } from "react"
import { Filter, Search } from "lucide-react"
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUserData } from '@/lib/auth'
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
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

interface Appointment {
  id: string
  clientId: string
  clientName: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

// Mock data for appointments
const generateAppointments = () => {
  const appointments = []
  const today = new Date()

  // Generate upcoming appointments
  for (let i = 0; i < 10; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    const hour = 9 + Math.floor(Math.random() * 9) // 9 AM to 6 PM
    const minute = Math.floor(Math.random() * 4) * 15 // 0, 15, 30, or 45 minutes

    appointments.push({
      id: `upcoming-${i}`,
      clientName: `Cliente ${i + 1}`,
      clientPhone: "+52 123 456 7890",
      date: new Date(date.setHours(hour, minute, 0, 0)).toISOString().split('T')[0],
      time: new Date(date.setHours(hour, minute, 0, 0)).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      duration: 40, // 40 minutes
      status: Math.random() > 0.3 ? "confirmed" : "pending", // 70% confirmed, 30% pending
    })
  }

  // Generate past appointments
  for (let i = 0; i < 15; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - (i + 1))

    const hour = 9 + Math.floor(Math.random() * 9) // 9 AM to 6 PM
    const minute = Math.floor(Math.random() * 4) * 15 // 0, 15, 30, or 45 minutes

    appointments.push({
      id: `past-${i}`,
      clientName: `Cliente ${i + 11}`,
      clientPhone: "+52 123 456 7890",
      date: new Date(date.setHours(hour, minute, 0, 0)).toISOString().split('T')[0],
      time: new Date(date.setHours(hour, minute, 0, 0)).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      duration: 40, // 40 minutes
      status: Math.random() > 0.2 ? "completed" : "cancelled", // 80% completed, 20% cancelled
    })
  }

  return appointments
}

const allAppointments = generateAppointments()

export default function AppointmentsPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming')
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null)

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
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function checkAuth() {
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
          <div className="flex gap-2">
            <Button
              variant={filter === 'upcoming' ? 'default' : 'outline'}
              onClick={() => setFilter('upcoming')}
            >
              Próximas
            </Button>
            <Button
              variant={filter === 'past' ? 'default' : 'outline'}
              onClick={() => setFilter('past')}
            >
              Pasadas
            </Button>
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              Todas
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
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
              {filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No hay citas que mostrar
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.clientName}</TableCell>
                    <TableCell>
                      {format(new Date(appointment.date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                    </TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          appointment.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : appointment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : appointment.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {appointment.status === 'confirmed'
                          ? 'Confirmada'
                          : appointment.status === 'pending'
                          ? 'Pendiente'
                          : appointment.status === 'cancelled'
                          ? 'Cancelada'
                          : 'Completada'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedAppointment(appointment)}>
                        Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedAppointment && (
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la cita</CardTitle>
            <CardDescription>Información de la cita seleccionada</CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentDetails appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

