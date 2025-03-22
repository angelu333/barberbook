"use client"

import { useState, useEffect } from "react"
import { Clock, Save, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimeRangePicker } from "@/components/time-range-picker"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const daysOfWeek = [
  { id: "monday", label: "Lunes" },
  { id: "tuesday", label: "Martes" },
  { id: "wednesday", label: "Miércoles" },
  { id: "thursday", label: "Jueves" },
  { id: "friday", label: "Viernes" },
  { id: "saturday", label: "Sábado" },
  { id: "sunday", label: "Domingo" },
]

// Datos iniciales de horario
const initialSchedule = {
  monday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  tuesday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  wednesday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  thursday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  friday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  saturday: { enabled: true, ranges: [{ start: "10:00", end: "15:00" }] },
  sunday: { enabled: false, ranges: [{ start: "10:00", end: "15:00" }] },
}

// Simular almacenamiento global (en una app real sería una base de datos)
let globalSchedule = { ...initialSchedule }

export default function SchedulePage() {
  const { toast } = useToast()
  const [schedule, setSchedule] = useState(globalSchedule)
  const [activeTab, setActiveTab] = useState("weekly")
  const [hasChanges, setHasChanges] = useState(false)

  // Detectar cambios en el horario
  useEffect(() => {
    // Comparar el horario actual con el global para detectar cambios
    const scheduleChanged = JSON.stringify(schedule) !== JSON.stringify(globalSchedule)
    setHasChanges(scheduleChanged)
  }, [schedule])

  const handleDayToggle = (day: string) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day as keyof typeof schedule],
        enabled: !schedule[day as keyof typeof schedule].enabled,
      },
    })
  }

  const handleTimeRangeChange = (day: string, index: number, field: "start" | "end", value: string) => {
    const daySchedule = schedule[day as keyof typeof schedule]
    const newRanges = [...daySchedule.ranges]
    newRanges[index] = { ...newRanges[index], [field]: value }

    setSchedule({
      ...schedule,
      [day]: {
        ...daySchedule,
        ranges: newRanges,
      },
    })
  }

  const addTimeRange = (day: string) => {
    const daySchedule = schedule[day as keyof typeof schedule]
    const lastRange = daySchedule.ranges[daySchedule.ranges.length - 1]

    setSchedule({
      ...schedule,
      [day]: {
        ...daySchedule,
        ranges: [...daySchedule.ranges, { start: lastRange.end, end: "18:00" }],
      },
    })
  }

  const removeTimeRange = (day: string, index: number) => {
    const daySchedule = schedule[day as keyof typeof schedule]
    const newRanges = daySchedule.ranges.filter((_, i) => i !== index)

    setSchedule({
      ...schedule,
      [day]: {
        ...daySchedule,
        ranges: newRanges.length > 0 ? newRanges : [{ start: "09:00", end: "18:00" }],
      },
    })
  }

  const handleSave = () => {
    // Actualizar el horario global
    globalSchedule = { ...schedule }

    // Simular guardado de horario
    toast({
      title: "Horario guardado",
      description: "Tu horario ha sido actualizado correctamente y se refleja en tu agenda.",
    })

    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gestión de Horarios</h2>
        <p className="text-muted-foreground">Configura tus horarios de disponibilidad</p>
      </div>

      {hasChanges && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Cambios sin guardar</AlertTitle>
          <AlertDescription>
            Has realizado cambios en tu horario. Asegúrate de guardarlos para que se reflejen en tu agenda.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="weekly">Horario Semanal</TabsTrigger>
          <TabsTrigger value="exceptions">Excepciones</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle>Horario Semanal</CardTitle>
              <CardDescription>Configura tu horario regular de trabajo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {daysOfWeek.map((day) => (
                <div key={day.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${day.id}-enabled`}
                        checked={schedule[day.id as keyof typeof schedule].enabled}
                        onCheckedChange={() => handleDayToggle(day.id)}
                      />
                      <Label htmlFor={`${day.id}-enabled`} className="font-medium">
                        {day.label}
                      </Label>
                    </div>

                    {schedule[day.id as keyof typeof schedule].enabled && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addTimeRange(day.id)}
                        className="border-primary/20 hover:bg-primary/5"
                      >
                        Agregar Horario
                      </Button>
                    )}
                  </div>

                  {schedule[day.id as keyof typeof schedule].enabled && (
                    <div className="space-y-2 pl-6">
                      {schedule[day.id as keyof typeof schedule].ranges.map((range, index) => (
                        <TimeRangePicker
                          key={index}
                          startTime={range.start}
                          endTime={range.end}
                          onStartTimeChange={(value) => handleTimeRangeChange(day.id, index, "start", value)}
                          onEndTimeChange={(value) => handleTimeRangeChange(day.id, index, "end", value)}
                          onRemove={
                            schedule[day.id as keyof typeof schedule].ranges.length > 1
                              ? () => removeTimeRange(day.id, index)
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  )}

                  {day.id !== "sunday" && <Separator />}
                </div>
              ))}
            </CardContent>
            <CardFooter className="bg-muted/10">
              <Button onClick={handleSave} className="ml-auto" disabled={!hasChanges}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="exceptions">
          <Card>
            <CardHeader className="bg-primary/5">
              <CardTitle>Días Especiales</CardTitle>
              <CardDescription>
                Configura excepciones para días específicos (vacaciones, días festivos, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <Clock className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Próximamente</h3>
                <p className="mt-2 text-sm text-muted-foreground">Esta funcionalidad estará disponible pronto</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  )
}

