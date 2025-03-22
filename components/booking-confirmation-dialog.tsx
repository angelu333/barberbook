"use client"

import { useRouter } from "next/navigation"
import { CalendarIcon, Check, Clock, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Barber {
  id: number
  name: string
  image: string
  shopName: string
  address: string
}

interface BookingConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  barber: Barber
  date: Date | undefined
  time: string | null
}

export function BookingConfirmationDialog({ open, onOpenChange, barber, date, time }: BookingConfirmationDialogProps) {
  const router = useRouter()

  const handleConfirm = () => {
    // Simular notificación por WhatsApp
    alert("¡Reserva confirmada! Se ha enviado una notificación por WhatsApp.")

    // Cerrar diálogo y redirigir al dashboard
    onOpenChange(false)

    // Usar setTimeout para asegurar que el estado se actualice correctamente antes de la navegación
    setTimeout(() => {
      router.push("/client/dashboard")
    }, 0)
  }

  // Asegurarnos de que tenemos fecha y hora válidas
  if (!date || !time) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Reserva</DialogTitle>
          <DialogDescription>Revisa los detalles de tu cita antes de confirmar</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-start gap-4">
            <img
              src={barber.image || "/placeholder.svg"}
              alt={barber.name}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium">{barber.name}</h3>
              <p className="text-sm text-muted-foreground">{barber.shopName}</p>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>
                {date.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{barber.address}</span>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Se enviará una confirmación por WhatsApp
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar Reserva</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

