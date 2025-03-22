'use client'

import { useEffect, useState } from 'react'
import { WeeklySchedule, subscribeToBarberSchedule } from '@/lib/firebase'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ScheduleDisplayProps {
  barberId: string
  selectedDate: Date
  onTimeSelect: (time: string) => void
}

export function ScheduleDisplay({ barberId, selectedDate, onTimeSelect }: ScheduleDisplayProps) {
  const [schedule, setSchedule] = useState<WeeklySchedule | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToBarberSchedule(barberId, (newSchedule) => {
      setSchedule(newSchedule)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [barberId])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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

  const dayOfWeek = format(selectedDate, 'EEEE', { locale: es }) as keyof WeeklySchedule
  const daySchedule = schedule[dayOfWeek.toLowerCase()]

  if (!daySchedule || !daySchedule.enabled) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No hay horarios disponibles para este día
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