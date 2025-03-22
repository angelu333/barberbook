"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingConfirmationDialog } from "@/components/booking-confirmation-dialog"

// Mock data for available times
const availableTimes = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
]

export default function BookAppointmentPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleConfirm = () => {
    setShowConfirmation(false)
    // Aquí iría la lógica para confirmar la reserva
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 lg:max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1 md:space-y-2">
          <CardTitle className="text-2xl md:text-3xl font-bold">Reservar Cita</CardTitle>
          <CardDescription className="text-base md:text-lg">
            Selecciona el día y la hora para tu cita
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:gap-8">
          <div className="grid gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 md:h-14 justify-start text-left font-normal text-base md:text-lg",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5 md:h-6 md:w-6" />
                  {date ? (
                    format(date, "EEEE d 'de' MMMM 'de' yyyy", {
                      locale: es,
                    })
                  ) : (
                    <span>Selecciona una fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  locale={es}
                  className="rounded-md border shadow-md"
                />
              </PopoverContent>
            </Popover>
          </div>
          {date && (
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-medium text-muted-foreground">
                Horarios disponibles
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {availableTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className={cn(
                      "w-full h-12 md:h-14 text-base md:text-lg transition-all",
                      selectedTime === time && "scale-[1.02] font-medium"
                    )}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="px-6 py-4 md:px-8 md:py-6">
          <Button
            className="w-full h-12 md:h-14 text-base md:text-lg font-medium"
            disabled={!date || !selectedTime}
            onClick={() => setShowConfirmation(true)}
          >
            Continuar
          </Button>
        </CardFooter>
      </Card>
      {date && selectedTime && (
        <BookingConfirmationDialog
          open={showConfirmation}
          onOpenChange={setShowConfirmation}
          date={date}
          time={selectedTime}
          barberName="Carlos Rodríguez"
          location="Av. Principal 123, Ciudad"
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}

