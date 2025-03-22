"use client"

import { useState, useEffect } from "react"
import { Clock, Save, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { WeeklySchedule, subscribeToBarberSchedule, updateBarberSchedule } from "@/lib/firebase"

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
import { Icons } from "@/components/icons"

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
const initialSchedule: WeeklySchedule = {
  monday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  tuesday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  wednesday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  thursday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  friday: { enabled: true, ranges: [{ start: "09:00", end: "18:00" }] },
  saturday: { enabled: true, ranges: [{ start: "10:00", end: "15:00" }] },
  sunday: { enabled: false, ranges: [{ start: "10:00", end: "15:00" }] },
}

export default function SchedulePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [schedule, setSchedule] = useState<WeeklySchedule>(initialSchedule)
  const [activeTab, setActiveTab] = useState("weekly")
  const [hasChanges, setHasChanges] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    async function setupScheduleListener() {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push('/login')
          return
        }

        // Suscribirse a cambios en el horario
        unsubscribe = subscribeToBarberSchedule(user.uid, (newSchedule) => {
          if (newSchedule) {
            setSchedule(newSchedule)
          } else {
            // Si no existe un horario, crear uno con los valores iniciales
            updateBarberSchedule(user.uid, initialSchedule)
            setSchedule(initialSchedule)
          }
          setLoading(false)
        })
      } catch (error) {
        console.error('Error al cargar horario:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar tu horario. Por favor, intenta de nuevo.",
        })
        setLoading(false)
      }
    }

    setupScheduleListener()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [router, toast])

  // Detectar cambios en el horario
  useEffect(() => {
    const scheduleChanged = JSON.stringify(schedule) !== JSON.stringify(initialSchedule)
    setHasChanges(scheduleChanged)
  }, [schedule])

  const handleDayToggle = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }))
  }

  const handleTimeRangeChange = (day: string, index: number, field: "start" | "end", value: string) => {
    setSchedule((prev) => {
      const daySchedule = prev[day]
      const newRanges = [...daySchedule.ranges]
      newRanges[index] = { ...newRanges[index], [field]: value }

      return {
        ...prev,
        [day]: {
          ...daySchedule,
          ranges: newRanges,
        },
      }
    })
  }

  const addTimeRange = (day: string) => {
    setSchedule((prev) => {
      const daySchedule = prev[day]
      const lastRange = daySchedule.ranges[daySchedule.ranges.length - 1]

      return {
        ...prev,
        [day]: {
          ...daySchedule,
          ranges: [...daySchedule.ranges, { start: lastRange.end, end: "18:00" }],
        },
      }
    })
  }

  const removeTimeRange = (day: string, index: number) => {
    setSchedule((prev) => {
      const daySchedule = prev[day]
      const newRanges = daySchedule.ranges.filter((_, i) => i !== index)

      return {
        ...prev,
        [day]: {
          ...daySchedule,
          ranges: newRanges.length > 0 ? newRanges : [{ start: "09:00", end: "18:00" }],
        },
      }
    })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const user = await getCurrentUser()
      if (!user) {
        throw new Error('No autenticado')
      }

      await updateBarberSchedule(user.uid, schedule)
      
      toast({
        title: "Horario guardado",
        description: "Tu horario ha sido actualizado correctamente y se refleja en tu agenda.",
      })

      setHasChanges(false)
    } catch (error) {
      console.error('Error al guardar horario:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar tu horario. Por favor, intenta de nuevo.",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Cargando...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
                          checked={schedule[day.id].enabled}
                          onCheckedChange={() => handleDayToggle(day.id)}
                        />
                        <Label htmlFor={`${day.id}-enabled`} className="font-medium">
                          {day.label}
                        </Label>
                      </div>

                      {schedule[day.id].enabled && (
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

                    {schedule[day.id].enabled && (
                      <div className="space-y-2 pl-6">
                        {schedule[day.id].ranges.map((range, index) => (
                          <TimeRangePicker
                            key={index}
                            startTime={range.start}
                            endTime={range.end}
                            onStartTimeChange={(value) => handleTimeRangeChange(day.id, index, "start", value)}
                            onEndTimeChange={(value) => handleTimeRangeChange(day.id, index, "end", value)}
                            onRemove={
                              schedule[day.id].ranges.length > 1
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
                <Button 
                  onClick={handleSave} 
                  className="ml-auto" 
                  disabled={!hasChanges || saving}
                >
                  {saving ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
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
    </div>
  )
}

