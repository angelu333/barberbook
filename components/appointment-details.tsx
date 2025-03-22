"use client"

import { useState } from "react"
import { Calendar, Clock, Phone, User, Check, Ban, Scissors } from "lucide-react"

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

interface Appointment {
  id: string
  clientName: string
  clientPhone: string
  date: Date
  duration: number
  status: "confirmed" | "pending" | "cancelled" | "completed"
  service?: string
  price?: string
}

interface AppointmentDetailsProps {
  appointment: Appointment
  onClose: () => void
  onUpdate?: (updatedAppointment: Appointment) => void
}

export function AppointmentDetails({ appointment, onClose, onUpdate }: AppointmentDetailsProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [currentAppointment, setCurrentAppointment] = useState(appointment)

  const handleConfirm = () => {
    // Simular notificación por WhatsApp
    const updatedAppointment = { ...currentAppointment, status: "confirmed" }
    setCurrentAppointment(updatedAppointment)
    setShowConfirmDialog(false)

    if (onUpdate) {
      onUpdate(updatedAppointment)
    }

    alert("¡Cita confirmada! Se ha enviado una notificación por WhatsApp al cliente.")
  }

  const handleCancel = () => {
    // Simular notificación por WhatsApp
    const updatedAppointment = { ...currentAppointment, status: "cancelled" }
    setCurrentAppointment(updatedAppointment)
    setShowCancelDialog(false)

    if (onUpdate) {
      onUpdate(updatedAppointment)
    }

    alert("Cita cancelada. Se ha enviado una notificación por WhatsApp al cliente.")
  }

  // Formatear fecha para mostrar
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Formatear hora para mostrar
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calcular hora de fin
  const getEndTime = (date: Date, durationMinutes: number) => {
    const endTime = new Date(date.getTime() + durationMinutes * 60000)
    return formatTime(endTime)
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
              {formatTime(currentAppointment.date)} - {getEndTime(currentAppointment.date, currentAppointment.duration)}
            </span>
          </div>

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
          <Button onClick={() => setShowConfirmDialog(true)} className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Confirmar Cita
          </Button>
        )}

        {(currentAppointment.status === "pending" || currentAppointment.status === "confirmed") && (
          <Button variant="destructive" onClick={() => setShowCancelDialog(true)} className="flex items-center gap-2">
            <Ban className="h-4 w-4" />
            Cancelar Cita
          </Button>
        )}
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Cita</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas confirmar esta cita? Se enviará una notificación por WhatsApp al cliente.
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
              ¿Estás seguro de que deseas cancelar esta cita? Se enviará una notificación por WhatsApp al cliente.
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

