"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { CalendarIcon, MapPin, Phone, Scissors, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingConfirmationDialog } from "@/components/booking-confirmation-dialog"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Mock data for barber
const barberData = {
  id: 1,
  name: "Carlos Rodríguez",
  image:
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  shopName: "Barbería Estilo",
  address: "Av. Principal 123, Ciudad",
  phone: "+52 123 456 7890",
  bio: "Especialista en cortes clásicos y modernos con más de 10 años de experiencia.",
  rating: 4.8,
  reviews: 124,
  services: [
    { id: 1, name: "Corte de cabello", price: "200" },
    { id: 2, name: "Arreglo de barba", price: "150" },
    { id: 3, name: "Corte + Barba", price: "300" },
    { id: 4, name: "Diseño de barba", price: "180" },
    { id: 5, name: "Corte infantil", price: "150" },
  ],
  gallery: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Corte clásico",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Degradado moderno",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Barba completa",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Corte texturizado",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1593702288056-f5834cfbef26?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Fade con diseño",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Estilo urbano",
    },
  ],
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
    { date: new Date(new Date().setDate(new Date().getDate() + 3)).setHours(16, 0, 0, 0), duration: 40 },
  ],
}

// Mock available time slots
const generateTimeSlots = (date: Date, barber: typeof barberData) => {
  if (!date) return []

  const slots = []
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  const dayOfWeek = dayNames[date.getDay()]
  const daySchedule = barber.schedule[dayOfWeek as keyof typeof barber.schedule]

  // Si el día no está habilitado, retornar array vacío
  if (!daySchedule.enabled || daySchedule.ranges.length === 0) {
    return slots
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

      if (!isBooked) {
        slots.push(new Date(currentTime))
      }

      // Avanzar al siguiente slot
      currentTime = new Date(currentTime.getTime() + slotDuration * 60000)
    }
  }

  return slots
}

export default function BarberProfilePage() {
  const params = useParams()
  const router = useRouter()
  const barberId = params.id
  const barber = barberData // En una app real, buscaríamos el barbero por ID

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<Date | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<Date[]>([])

  // Actualizar slots de tiempo cuando cambia la fecha
  useEffect(() => {
    if (date) {
      const slots = generateTimeSlots(date, barber)
      setAvailableTimeSlots(slots)
      setSelectedTime(null) // Resetear la hora seleccionada
    }
  }, [date])

  const handleBooking = () => {
    if (date && selectedTime) {
      setShowConfirmation(true)
    } else {
      toast({
        title: "Error",
        description: "Por favor selecciona una fecha y hora para tu cita",
        variant: "destructive",
      })
    }
  }

  // Formatear hora para mostrar
  const formatTime = (date: Date) => {
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{barber.name}</h2>
          <p className="text-muted-foreground">{barber.shopName}</p>
        </div>
        <Button asChild>
          <Link href={`/client/book?barberId=${barber.id}`}>Reservar Cita</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={barber.image || "/placeholder.svg"}
                      alt={barber.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 space-y-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{barber.rating}</span>
                    <span className="text-muted-foreground">({barber.reviews} reseñas)</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{barber.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{barber.phone}</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Acerca de</h3>
                    <p className="text-muted-foreground">{barber.bio}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="services">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="services">Servicios y Precios</TabsTrigger>
              <TabsTrigger value="gallery">Galería de Trabajos</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Servicios Ofrecidos</h3>
                    <div className="grid gap-2">
                      {barber.services.map((service) => (
                        <div key={service.id} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div className="flex items-center gap-2">
                            <Scissors className="h-4 w-4 text-primary" />
                            <span>{service.name}</span>
                          </div>
                          <span className="font-medium">${service.price} MXN</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Trabajos Realizados</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {barber.gallery.map((item) => (
                        <div key={item.id} className="space-y-2">
                          <div className="aspect-square rounded-lg overflow-hidden">
                            <img
                              src={item.url || "/placeholder.svg"}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm text-center">{item.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-medium">Reservar Cita</h3>

              <div className="space-y-2">
                <label className="text-sm font-medium">Selecciona una fecha</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus disabled={isDateDisabled} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Horarios disponibles</label>
                <div className="grid grid-cols-2 gap-2">
                  {date ? (
                    availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((time, index) => (
                        <Button
                          key={index}
                          variant={selectedTime?.getTime() === time.getTime() ? "default" : "outline"}
                          className={cn(
                            "h-10",
                            selectedTime?.getTime() === time.getTime() && "bg-primary text-primary-foreground",
                          )}
                          onClick={() => setSelectedTime(time)}
                        >
                          {formatTime(time)}
                        </Button>
                      ))
                    ) : (
                      <p className="col-span-2 text-center text-sm text-muted-foreground py-2">
                        No hay horarios disponibles para esta fecha
                      </p>
                    )
                  ) : (
                    <p className="col-span-2 text-center text-sm text-muted-foreground py-2">
                      Selecciona una fecha primero
                    </p>
                  )}
                </div>
              </div>

              <Button className="w-full" disabled={!date || !selectedTime} onClick={handleBooking}>
                Confirmar Reserva
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {showConfirmation && date && selectedTime && (
        <BookingConfirmationDialog
          open={showConfirmation}
          onOpenChange={setShowConfirmation}
          barber={barber}
          date={date}
          time={formatTime(selectedTime)}
        />
      )}

      <Toaster />
    </div>
  )
}

