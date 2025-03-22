"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, Clock, MapPin, User } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface BookingConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  date: Date
  time: string
  barberName: string
  location: string
}

export function BookingConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  date,
  time,
  barberName,
  location,
}: BookingConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-6 md:p-8">
        <DialogHeader className="space-y-2 md:space-y-3">
          <DialogTitle className="text-2xl md:text-3xl font-bold">
            Confirmar Reserva
          </DialogTitle>
          <DialogDescription className="text-base md:text-lg">
            Revisa los detalles de tu cita antes de confirmar
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-6 md:py-8">
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <span className="text-base md:text-lg">
                {format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <span className="text-base md:text-lg">{time}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <span className="text-base md:text-lg font-medium">{barberName}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <span className="text-base md:text-lg">{location}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={onConfirm} 
            className="w-full h-12 md:h-14 text-base md:text-lg font-medium"
          >
            Confirmar Reserva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

