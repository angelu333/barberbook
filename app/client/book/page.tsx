"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { CalendarIcon, Clock, AlertTriangle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { BookingConfirmationDialog } from "@/components/booking-confirmation-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

// Mock data for barber
const barber = {
  id: 1,
  name: "Carlos Rodríguez",
  image:
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  shopName: "Barbería Estilo",
  address: "Av. Principal 123, Ciudad",
  schedule: {
    monday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
    tuesday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
    wednesday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
    thursday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
    friday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
    saturday: { enabled: true, ranges: [{ start: "10:00", end: "15:00" }] },
    sunday: { enabled: false, ranges: [] },
  },
  // Citas existentes para mostrar disponibilidad
  appointments: [
    { date: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(10, 0, 0, 0), duration: 40 },
    { date: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(14, 0, 0, 0), duration: 40 },
    { date: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(11, 0, 0, 0), duration: 40 },
    { date: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(15, 30, 0, 0), duration: 40 },
    { date: new Date(new Date().setDate(new Date().getDate() + 3)).setHours(9, 0, 0, 0), duration: 40 },
    { date: new Date(new Date().setDate(new Date().getDate() + 3)).setHours(16, 0, 0, 0), duration: 40 },
    { date: new Date(new Date().setDate(new Date().getDate() + 4)).setHours(12, 0, 0, 0), duration: 40 },
    { date: new Date(new Date().setDate(new Date().getDate() + 5)).setHours(11, 0, 0, 0), duration: 40 },
  ],
}

// Mock available time slots
const generateTimeSlots = (date: Date | undefined) => {
  if (!date) return { available: [], occupied: [] }

  const available = []
  const occupied = []
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  const dayOfWeek = dayNames[date.getDay()]
  const daySchedule = barber.schedule[dayOfWeek as keyof typeof barber.schedule]

  // Si el día no está habilitado, retornar array vacío
  if (!daySchedule.enabled || daySchedule.ranges.length === 0) {
    return { available: [], occupied: [] }
  }

  // Para cada rango de horario en el día
  for (const range of daySchedule.ranges) {
    const [startHour, startMinute] = range.start.split(":").map(Number)
    const [endHour, endMinute] = range.end.split(":").map(Number)

    const startTime = new Date(date)
    startTime.setHours(startHour, startMinute, 0, 0)

    const endTime = new Date(date)
    endTime.setHours(endHour, endMinute, 0, 0)

    // Generar slots de 40 minutos
    const slotDuration = 40
    let currentTime = new Date(startTime)

    while (currentTime.getTime() + slotDuration * 60000 <= endTime.getTime()) {
      // Verificar si el slot ya está ocupado
      const isBooked = barber.appointments.some((appointment) => {
        const appointmentDate = new Date(appointment.date)
        return (
          appointmentDate.getDate() === currentTime.getDate() &&
          appointmentDate.getMonth() === currentTime.getMonth() &&
          appointmentDate.getFullYear() === currentTime.getFullYear() &&
          appointmentDate.getHours() === currentTime.getHours() &&
          appointmentDate.getMinutes() === currentTime.getMinutes()
        )
      })

      if (isBooked) {
        occupied.push(new Date(currentTime))
      } else {
        available.push(new Date(currentTime))
      }

      // Avanzar al siguiente slot
      currentTime = new Date(currentTime.getTime() + slotDuration * 60000)
    }
  }

  return { available, occupied }
}

export default function BookAppointmentPage() {
  const searchParams = useSearchParams()
  const barberId = searchParams.get("barberId")

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<Date | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<Date[]>([])
  const [occupiedTimeSlots, setOccupiedTimeSlots] = useState<Date[]>([])

  // Actualizar slots de tiempo cuando cambia la fecha
  useEffect(() => {
    if (date) {
      const { available, occupied } = generateTimeSlots(date)
      setAvailableTimeSlots(available)
      setOccupiedTimeSlots(occupied)
      setSelectedTime(null) // Resetear la hora seleccionada
    } else {
      setAvailableTimeSlots([])
      setOccupiedTimeSlots([])
      setSelectedTime(null)
    }
  }, [date])

  const handleBooking = () => {
    if (date && selectedTime) {
      setShowConfirmation(true)
    }
  }

  // Formatear hora para mostrar
  const formatTime = (date: Date | null) => {
    if (!date) return ""
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  // Verificar si una fecha está deshabilitada (días pasados o días no laborables)
  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Deshabilitar fechas pasadas
    if (date < today) return true

    // Deshabilitar días no laborables
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const dayOfWeek = dayNames[date.getDay()]
    const daySchedule = barber.schedule[dayOfWeek as keyof typeof barber.schedule]

    return !daySchedule.enabled || daySchedule.ranges.length === 0
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reservar Cita</h2>
        <p className="text-muted-foreground">Selecciona fecha y hora para tu cita</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle>Selecciona una fecha</CardTitle>
            <CardDescription>Elige el día para tu cita</CardDescription>
          </CardHeader>
          <CardContent className="pb-4 pt-6">
            <div className="flex justify-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                      "border-primary/20 hover:bg-primary/5",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      date.toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus disabled={isDateDisabled} />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle>Selecciona una hora</CardTitle>
            <CardDescription>
              Horarios disponibles para{" "}
              {date
                ? date.toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                  })
                : "la fecha seleccionada"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {date ? (
              <>
                {availableTimeSlots.length > 0 ? (
                  <>
                    {occupiedTimeSlots.length > 0 && (
                      <Alert className="mb-4 bg-yellow-500/10 border-yellow-500/20">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <AlertTitle className="text-yellow-500">Horarios ocupados</AlertTitle>
                        <AlertDescription className="text-yellow-500/80">
                          Algunos horarios ya están reservados y no están disponibles.
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimeSlots.map((time, index) => (
                        <Button
                          key={index}
                          variant={selectedTime?.getTime() === time.getTime() ? "default" : "outline"}
                          className={cn(
                            "h-10 border-primary/20 hover:bg-primary/5",
                            selectedTime?.getTime() === time.getTime() && "bg-primary text-primary-foreground",
                          )}
                          onClick={() => setSelectedTime(time)}
                        >
                          {formatTime(time)}
                        </Button>
                      ))}

                      {occupiedTimeSlots.map((time, index) => (
                        <Button
                          key={`occupied-${index}`}
                          variant="outline"
                          className="h-10 opacity-50 cursor-not-allowed border-red-500/20 bg-red-500/5"
                          disabled
                        >
                          <Badge
                            variant="outline"
                            className="pointer-events-none border-red-500/50 text-red-500 text-[10px]"
                          >
                            Ocupado
                          </Badge>
                          <span className="ml-1">{formatTime(time)}</span>
                        </Button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No hay horarios disponibles para esta fecha</p>
                    <Button
                      variant="outline"
                      className="mt-4 border-primary/20 hover:bg-primary/5"
                      onClick={() => setDate(undefined)}
                    >
                      Seleccionar otra fecha
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarIcon className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Selecciona una fecha primero</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Card className="border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle>Detalles de la reserva</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <img
              src={barber.image || "/placeholder.svg"}
              alt={barber.name}
              className="h-16 w-16 rounded-full object-cover border-2 border-primary/20"
            />
            <div>
              <h3 className="font-medium">{barber.name}</h3>
              <p className="text-sm text-muted-foreground">{barber.shopName}</p>
              <p className="text-sm text-muted-foreground">{barber.address}</p>

              <div className="mt-4 flex flex-wrap gap-4">
                {date && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {date.toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {selectedTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm">{formatTime(selectedTime)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/10">
          <Button className="w-full" disabled={!date || !selectedTime} onClick={handleBooking}>
            Confirmar Reserva
          </Button>
        </CardFooter>
      </Card>

      {showConfirmation && (
        <BookingConfirmationDialog
          open={showConfirmation}
          onOpenChange={setShowConfirmation}
          barber={barber}
          date={date}
          time={selectedTime ? formatTime(selectedTime) : null}
        />
      )}
    </div>
  )
}

