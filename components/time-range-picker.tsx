"use client"

import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimeRangePickerProps {
  startTime: string
  endTime: string
  onStartTimeChange: (value: string) => void
  onEndTimeChange: (value: string) => void
  onRemove?: () => void
}

export function TimeRangePicker({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  onRemove,
}: TimeRangePickerProps) {
  // Generar opciones de tiempo en incrementos de 30 minutos
  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0")
        const formattedMinute = minute.toString().padStart(2, "0")
        options.push(`${formattedHour}:${formattedMinute}`)
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()

  return (
    <div className="flex items-center gap-2">
      <Select value={startTime} onValueChange={onStartTimeChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Inicio" />
        </SelectTrigger>
        <SelectContent>
          {timeOptions.map((time) => (
            <SelectItem key={`start-${time}`} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-muted-foreground">a</span>

      <Select value={endTime} onValueChange={onEndTimeChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Fin" />
        </SelectTrigger>
        <SelectContent>
          {timeOptions.map((time) => (
            <SelectItem key={`end-${time}`} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {onRemove && (
        <Button variant="ghost" size="icon" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

