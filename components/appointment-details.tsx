"use client"

import { useState } from "react"
import { Calendar, Clock, Phone, User, Check, Ban, Scissors } from "lucide-react"
import { format, parse } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Appointment, updateAppointmentStatus } from "@/lib/firebase"
import { toast } from "sonner"
import { Icons } from "@/components/icons"

interface AppointmentDetailsProps {
  appointment: Appointment
  onClose: () => void
  onUpdate?: (updatedAppointment: Appointment) => void
}

export function AppointmentDetails({ appointment, onClose, onUpdate }: AppointmentDetailsProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [currentAppointment, setCurrentAppointment] = useState(appointment)
  const [updating, setUpdating] = useState(false)

  const handleConfirm = async () => {
    try {
      setUpdating(true)
      await updateAppointmentStatus(currentAppointment.id, "confirmed")
      
      const updatedAppointment: Appointment = {
        ...currentAppointment,
        status: "confirmed"
      }
      setCurrentAppointment(updatedAppointment)
      setShowConfirmDialog(false)

      if (onUpdate) {
        onUpdate(updatedAppointment)
      }

      toast.success('Cita confirmada correctamente')
    } catch (error) {
      console.error('Error al confirmar cita:', error)
      toast.error('Error al confirmar la cita')
    } finally {
      setUpdating(false)
    }
  }

  const handleCancel = async () => {
    try {
      setUpdating(true)
      await updateAppointmentStatus(currentAppointment.id, "cancelled")
      
      const updatedAppointment: Appointment = {
        ...currentAppointment,
        status: "cancelled"
      }
      setCurrentAppointment(updatedAppointment)
      setShowCancelDialog(false)

      if (onUpdate) {
        onUpdate(updatedAppointment)
      }

      toast.success('Cita cancelada correctamente')
    } catch (error) {
      console.error('Error al cancelar cita:', error)
      toast.error('Error al cancelar la cita')
    } finally {
      setUpdating(false)
    }
  }

  // Formatear fecha para mostrar
  const formatDate = (dateStr: string) => {
    const date = parse(dateStr, 'yyyy-MM-dd', new Date())
    return format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
  }

  // Calcular hora de fin
  const getEndTime = (timeStr: string, durationMinutes: number) => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    const date = new Date()
    date.setHours(hours, minutes)
    const endTime = new Date(date.getTime() + durationMinutes * 60000)
    return format(endTime, 'HH:mm')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">{currentAppointment.clientName}</h3>
        </div>
      </div>

      <Card className="p-4 bg-muted/10">
        <div className="flex items-center gap-2 mb-2">
          <Badge
            variant="outline"
            className={
              currentAppointment.status === "confirmed"
                ? "border-green-500 text-green-500"
                : currentAppointment.status === "pending"
                  ? "border-yellow-500 text-yellow-500"
                  : currentAppointment.status === "completed"
                    ? "border-blue-500 text-blue-500"
                    : "border-red-500 text-red-500"
            }
          >
            {currentAppointment.status === "confirmed"
              ? "Confirmada"
              : currentAppointment.status === "pending"
                ? "Pendiente"
                : currentAppointment.status === "completed"
                  ? "Completada"
                  : "Cancelada"}
          </Badge>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(currentAppointment.date)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {currentAppointment.time} - {getEndTime(currentAppointment.time, currentAppointment.duration)}
            </span>
          </div>

          {currentAppointment.clientPhone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a
                href={`https://wa.me/${currentAppointment.clientPhone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                {currentAppointment.clientPhone}
              </a>
            </div>
          )}

          {currentAppointment.service && (
            <div className="flex items-center gap-2">
              <Scissors className="h-4 w-4 text-muted-foreground" />
              <span>{currentAppointment.service}</span>
              {currentAppointment.price && <span className="font-medium ml-auto">{currentAppointment.price}</span>}
            </div>
          )}
        </div>
      </Card>

      <div className="flex flex-wrap justify-end gap-2 pt-2">
        {currentAppointment.status === "pending" && (
          <Button 
            onClick={() => setShowConfirmDialog(true)} 
            className="flex items-center gap-2"
            disabled={updating}
          >
            {updating ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Confirmando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Confirmar Cita
              </>
            )}
          </Button>
        )}

        {(currentAppointment.status === "pending" || currentAppointment.status === "confirmed") && (
          <Button 
            variant="destructive" 
            onClick={() => setShowCancelDialog(true)} 
            className="flex items-center gap-2"
            disabled={updating}
          >
            {updating ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Cancelando...
              </>
            ) : (
              <>
                <Ban className="h-4 w-4" />
                Cancelar Cita
              </>
            )}
          </Button>
        )}
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Cita</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas confirmar esta cita? Se notificará al cliente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Cita</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas cancelar esta cita? Se notificará al cliente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, mantener cita</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground">
              Sí, cancelar cita
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

