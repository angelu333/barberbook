'use client'

import { useEffect, useState } from 'react'
import { WeeklySchedule, subscribeToBarberSchedule } from '@/lib/firebase'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import { Icons } from '@/components/icons'

interface ScheduleDisplayProps {
  barberId: string
  selectedDate: Date
  onTimeSelect: (time: string) => void
}

const dayMapping: Record<string, keyof WeeklySchedule> = {
  'domingo': 'sunday',
  'lunes': 'monday',
  'martes': 'tuesday',
  'miércoles': 'wednesday',
  'jueves': 'thursday',
  'viernes': 'friday',
  'sábado': 'saturday'
}

export function ScheduleDisplay({ barberId, selectedDate, onTimeSelect }: ScheduleDisplayProps) {
  const [schedule, setSchedule] = useState<WeeklySchedule | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('Loading schedule for barber:', barberId)
    const unsubscribe = subscribeToBarberSchedule(barberId, (newSchedule) => {
      console.log('Received schedule:', newSchedule)
      setSchedule(newSchedule)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [barberId])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4 text-destructive">
        {error}
      </div>
    )
  }

  if (!schedule) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No hay horarios disponibles
      </div>
    )
  }

  const formattedDay = format(selectedDate, 'EEEE', { locale: es }).toLowerCase()
  const dayKey = dayMapping[formattedDay]

  if (!dayKey || !schedule[dayKey]) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No hay horarios configurados para este día
      </div>
    )
  }

  const daySchedule = schedule[dayKey]

  if (!daySchedule.enabled) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No hay atención este día
      </div>
    )
  }

  const generateTimeSlots = (start: string, end: string): string[] => {
    const slots: string[] = []
    let currentTime = new Date(`2000-01-01T${start}`)
    const endTime = new Date(`2000-01-01T${end}`)

    while (currentTime < endTime) {
      slots.push(format(currentTime, 'HH:mm'))
      currentTime = new Date(currentTime.getTime() + 30 * 60000) // Agregar 30 minutos
    }

    return slots
  }

  const allTimeSlots = daySchedule.ranges.flatMap(range => 
    generateTimeSlots(range.start, range.end)
  )

  if (allTimeSlots.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No hay horarios disponibles para este día
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2 p-4">
      {allTimeSlots.map((time) => (
        <button
          key={time}
          onClick={() => onTimeSelect(time)}
          className="px-4 py-2 text-sm rounded-md border hover:bg-primary/5 transition-colors"
        >
          {time}
        </button>
      ))}
    </div>
  )
} 