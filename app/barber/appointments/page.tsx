"use client"

import { Calendar } from "@/components/ui/calendar"

import { useState } from "react"
import { Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppointmentDetails } from "@/components/appointment-details"

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
      date: new Date(date.setHours(hour, minute, 0, 0)),
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
      date: new Date(date.setHours(hour, minute, 0, 0)),
      duration: 40, // 40 minutes
      status: Math.random() > 0.2 ? "completed" : "cancelled", // 80% completed, 20% cancelled
    })
  }

  return appointments
}

const allAppointments = generateAppointments()

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null)

  // Filter appointments
  const filterAppointments = (appointments: any[]) => {
    return appointments.filter((appointment) => {
      const matchesSearch = appointment.clientName.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || appointment.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }

  // Separate upcoming and past appointments
  const upcomingAppointments = allAppointments
    .filter((appointment) => appointment.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const pastAppointments = allAppointments
    .filter((appointment) => appointment.date <= new Date())
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  const filteredUpcoming = filterAppointments(upcomingAppointments)
  const filteredPast = filterAppointments(pastAppointments)

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gestión de Citas</h2>
        <p className="text-muted-foreground">Administra tus citas pendientes y pasadas</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre de cliente..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="confirmed">Confirmadas</SelectItem>
              <SelectItem value="completed">Completadas</SelectItem>
              <SelectItem value="cancelled">Canceladas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Próximas ({filteredUpcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Historial ({filteredPast.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {filteredUpcoming.length > 0 ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 p-4 font-medium">
                <div className="col-span-3">Cliente</div>
                <div className="col-span-3">Fecha</div>
                <div className="col-span-2">Hora</div>
                <div className="col-span-2">Estado</div>
                <div className="col-span-2 text-right">Acciones</div>
              </div>
              <Separator />
              {filteredUpcoming.map((appointment) => (
                <div key={appointment.id} className="grid grid-cols-12 gap-4 p-4">
                  <div className="col-span-3">{appointment.clientName}</div>
                  <div className="col-span-3">{formatDate(appointment.date)}</div>
                  <div className="col-span-2">{formatTime(appointment.date)}</div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-1">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          appointment.status === "confirmed" ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      />
                      <span className="capitalize">{appointment.status}</span>
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No hay citas próximas</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  No se encontraron citas que coincidan con tu búsqueda
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {filteredPast.length > 0 ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 p-4 font-medium">
                <div className="col-span-3">Cliente</div>
                <div className="col-span-3">Fecha</div>
                <div className="col-span-2">Hora</div>
                <div className="col-span-2">Estado</div>
                <div className="col-span-2 text-right">Acciones</div>
              </div>
              <Separator />
              {filteredPast.map((appointment) => (
                <div key={appointment.id} className="grid grid-cols-12 gap-4 p-4">
                  <div className="col-span-3">{appointment.clientName}</div>
                  <div className="col-span-3">{formatDate(appointment.date)}</div>
                  <div className="col-span-2">{formatTime(appointment.date)}</div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-1">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          appointment.status === "completed" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="capitalize">{appointment.status}</span>
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No hay historial de citas</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  No se encontraron citas que coincidan con tu búsqueda
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

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

