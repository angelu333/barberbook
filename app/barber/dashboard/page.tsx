"use client"

import { useState, useEffect, useMemo } from "react"
import { ChevronLeft, ChevronRight, Clock, User, CalendarIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppointmentDetails } from "@/components/appointment-details"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Datos de horario del barbero (simulando que viene de una base de datos)
const barberSchedule = {
  monday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  tuesday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  wednesday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  thursday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  friday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  saturday: { enabled: true, ranges: [{ start: "10:00", end: "15:00" }] },
  sunday: { enabled: false, ranges: [] },
}

// Mock data for appointments
const generateAppointments = (schedule: typeof barberSchedule) => {
  const appointments = []
  const today = new Date()

  // Nombres de clientes para ejemplos
  const clientNames = [
    "Juan Pérez",
    "María García",
    "Carlos López",
    "Ana Martínez",
    "Roberto Sánchez",
    "Laura Rodríguez",
    "Miguel Hernández",
    "Sofía Torres",
    "Fernando Díaz",
    "Lucía Gómez",
    "Javier Ruiz",
    "Carmen Flores",
  ]

  // Números de teléfono para ejemplos
  const phoneNumbers = [
    "+52 123 456 7890",
    "+52 234 567 8901",
    "+52 345 678 9012",
    "+52 456 789 0123",
    "+52 567 890 1234",
    "+52 678 901 2345",
  ]

  // Generar citas para los próximos 14 días (2 semanas)
  for (let i = 0; i < 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    // Verificar si el día está habilitado en el horario
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const dayOfWeek = dayNames[date.getDay()]
    const daySchedule = schedule[dayOfWeek as keyof typeof schedule]

    if (!daySchedule.enabled || daySchedule.ranges.length === 0) {
      continue // Saltar días no habilitados
    }

    // Número de citas por día (3-7 para tener ejemplos visibles)
    const numAppointments = Math.floor(Math.random() * 5) + 3

    // Crear un conjunto para rastrear las horas ya ocupadas
    const occupiedTimes = new Set()

    for (let j = 0; j < numAppointments; j++) {
      // Generar hora dentro del rango de horario del barbero
      const range = daySchedule.ranges[0] // Usar el primer rango por simplicidad
      const [startHour, startMinute] = range.start.split(":").map(Number)
      const [endHour, endMinute] = range.end.split(":").map(Number)

      // Calcular minutos totales disponibles y elegir un punto aleatorio
      const startTotalMinutes = startHour * 60 + startMinute
      const endTotalMinutes = endHour * 60 + endMinute - 40 // Restar duración de cita

      let randomMinutes
      let hour
      let minute
      let timeKey

      // Asegurarse de que no haya superposición de citas
      do {
        randomMinutes = startTotalMinutes + Math.floor(Math.random() * (endTotalMinutes - startTotalMinutes))
        // Redondear a incrementos de 20 minutos
        randomMinutes = Math.floor(randomMinutes / 20) * 20

        hour = Math.floor(randomMinutes / 60)
        minute = randomMinutes % 60

        timeKey = `${hour}:${minute}`
      } while (occupiedTimes.has(timeKey) && occupiedTimes.size < (endTotalMinutes - startTotalMinutes) / 20)

      // Si todas las horas están ocupadas, salir del bucle
      if (occupiedTimes.has(timeKey)) {
        break
      }

      // Marcar esta hora como ocupada
      occupiedTimes.add(timeKey)

      const appointmentDate = new Date(date)
      appointmentDate.setHours(hour, minute, 0, 0)

      // Determinar el estado de la cita
      let status
      if (appointmentDate < today) {
        // Citas pasadas son completadas o canceladas
        status = Math.random() > 0.2 ? "completed" : "cancelled"
      } else {
        // Citas futuras son confirmadas o pendientes
        status = Math.random() > 0.3 ? "confirmed" : "pending"
      }

      appointments.push({
        id: `${i}-${j}`,
        clientName: clientNames[Math.floor(Math.random() * clientNames.length)],
        clientPhone: phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)],
        date: appointmentDate,
        duration: 40, // 40 minutos
        status: status,
        service: Math.random() > 0.5 ? "Corte de cabello" : "Corte + Barba",
        price: Math.random() > 0.5 ? "$200" : "$300",
      })
    }
  }

  return appointments
}

// Función para agrupar citas por día
const groupAppointmentsByDay = (appointments: any[]) => {
  const grouped: Record<string, any[]> = {}

  appointments.forEach((appointment) => {
    const dateStr = appointment.date.toDateString()
    if (!grouped[dateStr]) {
      grouped[dateStr] = []
    }
    grouped[dateStr].push(appointment)
  })

  return grouped
}

// Función para obtener slots de tiempo para un día
const getTimeSlots = () => {
  const slots = []
  const startHour = 8 // 8 AM
  const endHour = 20 // 8 PM

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 20) {
      if (hour === endHour - 1 && minute + 20 > 60) continue

      const date = new Date()
      date.setHours(hour, minute, 0, 0)
      slots.push(date)
    }
  }

  return slots
}

export default function BarberDashboard() {
  const { toast } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null)
  const [schedule, setSchedule] = useState(barberSchedule)
  const [appointments, setAppointments] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState("week")

  // Generar citas basadas en el horario actual
  useEffect(() => {
    const newAppointments = generateAppointments(schedule)
    setAppointments(newAppointments)
  }, [schedule])

  // Filtrar citas por estado
  const filteredAppointments = useMemo(() => {
    if (statusFilter === "all") return appointments
    return appointments.filter((appointment) => appointment.status === statusFilter)
  }, [appointments, statusFilter])

  // Obtener las fechas de la semana
  const weekDates = useMemo(() => {
    const dates = []

    // Si estamos en vista diaria, solo devolver el día actual
    if (viewMode === "day" && selectedDate) {
      return [new Date(selectedDate)]
    }

    // Para vista semanal, obtener los 7 días de la semana
    const startDate = new Date(currentDate)
    startDate.setDate(currentDate.getDate() - currentDate.getDay()) // Comenzar desde domingo

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      dates.push(date)
    }

    return dates
  }, [currentDate, selectedDate, viewMode])

  const timeSlots = useMemo(() => getTimeSlots(), [])

  const groupedAppointments = useMemo(() => groupAppointmentsByDay(filteredAppointments), [filteredAppointments])

  // Navegar a la semana anterior/siguiente
  const goToPreviousWeek = () => {
    if (viewMode === "day" && selectedDate) {
      const newDate = new Date(selectedDate)
      newDate.setDate(selectedDate.getDate() - 1)
      setSelectedDate(newDate)
      return
    }

    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const goToNextWeek = () => {
    if (viewMode === "day" && selectedDate) {
      const newDate = new Date(selectedDate)
      newDate.setDate(selectedDate.getDate() + 1)
      setSelectedDate(newDate)
      return
    }

    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  // Formatear fecha para mostrar
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
    })
  }

  // Verificar si existe una cita en un slot de tiempo específico
  const getAppointmentAtTimeSlot = (date: Date, timeSlot: Date) => {
    const dateStr = date.toDateString()
    const appointments = groupedAppointments[dateStr] || []

    return appointments.find((appointment) => {
      const appointmentHour = appointment.date.getHours()
      const appointmentMinute = appointment.date.getMinutes()
      const slotHour = timeSlot.getHours()
      const slotMinute = timeSlot.getMinutes()

      return appointmentHour === slotHour && appointmentMinute === slotMinute
    })
  }

  // Verificar si un día está habilitado en el horario
  const isDayEnabled = (date: Date) => {
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const dayOfWeek = dayNames[date.getDay()]
    const daySchedule = schedule[dayOfWeek as keyof typeof schedule]

    return daySchedule.enabled && daySchedule.ranges.length > 0
  }

  // Verificar si un slot de tiempo está dentro del horario del barbero
  const isTimeSlotInSchedule = (date: Date, timeSlot: Date) => {
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const dayOfWeek = dayNames[date.getDay()]
    const daySchedule = schedule[dayOfWeek as keyof typeof schedule]

    if (!daySchedule.enabled) return false

    const slotHour = timeSlot.getHours()
    const slotMinute = timeSlot.getMinutes()

    // Verificar si el slot está dentro de algún rango de horario
    return daySchedule.ranges.some((range) => {
      const [startHour, startMinute] = range.start.split(":").map(Number)
      const [endHour, endMinute] = range.end.split(":").map(Number)

      const slotTotalMinutes = slotHour * 60 + slotMinute
      const startTotalMinutes = startHour * 60 + startMinute
      const endTotalMinutes = endHour * 60 + endMinute

      return slotTotalMinutes >= startTotalMinutes && slotTotalMinutes < endTotalMinutes
    })
  }

  // Manejar cambios en las citas
  const handleAppointmentUpdate = (updatedAppointment: any) => {
    setAppointments(
      appointments.map((appointment) => (appointment.id === updatedAppointment.id ? updatedAppointment : appointment)),
    )

    toast({
      title: "Cita actualizada",
      description: `La cita con ${updatedAppointment.clientName} ha sido actualizada.`,
    })
  }

  // Cambiar entre vista semanal y diaria
  const handleViewModeChange = (mode: string) => {
    setViewMode(mode)
    if (mode === "day" && !selectedDate) {
      setSelectedDate(new Date())
    }
  }

  // Obtener el título de la vista actual
  const getViewTitle = () => {
    if (viewMode === "day" && selectedDate) {
      return selectedDate.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    }

    if (weekDates.length === 0) return ""

    const firstDay = weekDates[0]
    const lastDay = weekDates[weekDates.length - 1]

    const firstMonth = firstDay.toLocaleDateString("es-ES", { month: "long" })
    const lastMonth = lastDay.toLocaleDateString("es-ES", { month: "long" })

    if (firstMonth === lastMonth) {
      return `${firstDay.getDate()} - ${lastDay.getDate()} de ${firstMonth}, ${firstDay.getFullYear()}`
    }

    return `${firstDay.getDate()} de ${firstMonth} - ${lastDay.getDate()} de ${lastMonth}, ${firstDay.getFullYear()}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agenda</h2>
          <p className="text-muted-foreground">Gestiona tus citas y horarios</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={viewMode} onValueChange={handleViewModeChange} className="mr-2">
            <TabsList className="h-9">
              <TabsTrigger value="week" className="text-xs px-3">
                Semana
              </TabsTrigger>
              <TabsTrigger value="day" className="text-xs px-3">
                Día
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9 px-3 text-xs font-normal">
                  {getViewTitle()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date)
                      if (viewMode === "week") {
                        setCurrentDate(date)
                      }
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="icon" className="h-9 w-9" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="confirmed">Confirmadas</SelectItem>
              <SelectItem value="completed">Completadas</SelectItem>
              <SelectItem value="cancelled">Canceladas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="overflow-hidden border-primary/20">
        <CardHeader className="bg-primary/5 pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            {viewMode === "week" ? "Vista Semanal" : "Vista Diaria"}
          </CardTitle>
          <CardDescription>
            {viewMode === "week"
              ? "Visualiza y gestiona tus citas para la semana"
              : "Visualiza y gestiona tus citas para el día seleccionado"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-8 gap-0 overflow-x-auto">
            {/* Columna de slots de tiempo */}
            <div className="pt-10 bg-muted/30 border-r">
              {timeSlots.map((slot, index) => (
                <div key={index} className="flex h-16 items-center justify-end pr-2 text-xs font-medium">
                  {slot.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                </div>
              ))}
            </div>

            {/* Columnas de días */}
            {weekDates.map((date, dateIndex) => (
              <div key={dateIndex} className={cn("flex flex-col", viewMode === "day" ? "col-span-7" : "")}>
                <div
                  className={cn(
                    "h-10 border-b p-2 text-center sticky top-0 z-10",
                    isDayEnabled(date) ? "bg-background" : "bg-muted/50",
                    date.toDateString() === new Date().toDateString() && "bg-primary/10 font-medium",
                  )}
                >
                  <div className="text-xs font-medium">{formatDate(date)}</div>
                </div>

                {timeSlots.map((timeSlot, timeIndex) => {
                  const appointment = getAppointmentAtTimeSlot(date, timeSlot)
                  const isInSchedule = isTimeSlotInSchedule(date, timeSlot)

                  return (
                    <div
                      key={`${dateIndex}-${timeIndex}`}
                      className={cn(
                        "relative h-16 border-b border-r p-1",
                        !isInSchedule && "bg-muted/20",
                        appointment && isInSchedule && "bg-primary/10",
                        appointment?.status === "pending" && "bg-yellow-500/10",
                        appointment?.status === "cancelled" && "bg-red-500/10",
                        appointment?.status === "completed" && "bg-green-500/10",
                        timeIndex % 3 === 0 && "border-t border-dashed border-t-muted",
                      )}
                    >
                      {appointment && isInSchedule ? (
                        <Button
                          variant="ghost"
                          className={cn(
                            "h-full w-full justify-start p-1 text-left",
                            viewMode === "day" && "flex-col items-start",
                          )}
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          <div
                            className={cn(
                              "flex w-full flex-col overflow-hidden",
                              viewMode === "day" && "flex-row items-center gap-2",
                            )}
                          >
                            <span
                              className={cn(
                                "flex items-center gap-1 text-xs font-medium",
                                viewMode === "day" && "text-sm",
                              )}
                            >
                              <User className="h-3 w-3" />
                              {appointment.clientName}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {appointment.date.toLocaleTimeString("es-ES", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "mt-1 text-[10px] h-4 w-fit",
                                appointment.status === "confirmed" && "border-green-500 text-green-500",
                                appointment.status === "pending" && "border-yellow-500 text-yellow-500",
                                appointment.status === "cancelled" && "border-red-500 text-red-500",
                                appointment.status === "completed" && "border-blue-500 text-blue-500",
                                viewMode === "day" && "text-xs h-5",
                              )}
                            >
                              {appointment.status === "confirmed"
                                ? "Confirmada"
                                : appointment.status === "pending"
                                  ? "Pendiente"
                                  : appointment.status === "completed"
                                    ? "Completada"
                                    : "Cancelada"}
                            </Badge>

                            {viewMode === "day" && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs">{appointment.service}</span>
                                <span className="text-xs font-medium">{appointment.price}</span>
                              </div>
                            )}
                          </div>
                        </Button>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedAppointment && (
        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Detalles de la cita
                </CardTitle>
                <CardDescription>Información de la cita seleccionada</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedAppointment(null)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
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

      <Toaster />
    </div>
  )
}

