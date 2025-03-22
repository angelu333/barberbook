'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUserData } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { doc, getDoc, addDoc, collection } from 'firebase/firestore'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScheduleDisplay } from '@/components/schedule-display'
import { toast } from 'sonner'
import { Icons } from '@/components/icons'

interface BookingPageProps {
  params: {
    barberId: string
  }
}

export default function BookingPage({ params }: BookingPageProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [barberData, setBarberData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    async function loadBarberData() {
      try {
        const barberDoc = await getDoc(doc(db, 'users', params.barberId))
        if (!barberDoc.exists()) {
          toast.error('Barbero no encontrado')
          router.push('/client/dashboard')
          return
        }
        setBarberData(barberDoc.data())
      } catch (error) {
        console.error('Error al cargar datos del barbero:', error)
        toast.error('Error al cargar datos del barbero')
      } finally {
        setLoading(false)
      }
    }

    loadBarberData()
  }, [params.barberId, router])

  const handleBooking = async () => {
    try {
      setBooking(true)
      const user = await getCurrentUser()
      if (!user) {
        throw new Error('No autenticado')
      }

      const userData = await getUserData(user.uid)
      if (!userData) {
        throw new Error('No se encontraron datos del usuario')
      }

      const appointment = {
        barberId: params.barberId,
        barberName: barberData.name,
        clientId: user.uid,
        clientName: userData.name,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        status: 'pending',
        createdAt: new Date().toISOString()
      }

      await addDoc(collection(db, 'appointments'), appointment)

      toast.success('Cita agendada correctamente')
      router.push('/client/dashboard')
    } catch (error) {
      console.error('Error al agendar cita:', error)
      toast.error('Error al agendar la cita')
    } finally {
      setBooking(false)
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Agendar Cita</h1>
          <p className="text-muted-foreground">
            con {barberData.name}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Selecciona una fecha</CardTitle>
              <CardDescription>
                Elige el día para tu cita
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date)
                    setSelectedTime(null)
                  }
                }}
                locale={es}
                disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selecciona una hora</CardTitle>
              <CardDescription>
                Horarios disponibles para {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScheduleDisplay
                barberId={params.barberId}
                selectedDate={selectedDate}
                onTimeSelect={setSelectedTime}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/client/dashboard')}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleBooking}
            disabled={!selectedTime || booking}
          >
            {booking ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Agendando...
              </>
            ) : (
              'Agendar Cita'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 