'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUserData, UserData } from '@/lib/auth'
import { doc, getDoc, addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Barber extends UserData {
  id: string
  experience: number
  specialties: string[]
  description: string
  imageUrl?: string
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
]

export default function BookAppointment({ params }: { params: { barberId: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [barber, setBarber] = useState<Barber | null>(null)
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    async function loadBarber() {
      try {
        // Verificar cliente autenticado
        const firebaseUser = await getCurrentUser()
        if (!firebaseUser) {
          router.push('/login')
          return
        }

        const userData = await getUserData(firebaseUser.uid)
        if (!userData || userData.role !== 'client') {
          router.push('/login')
          return
        }

        // Cargar datos del barbero
        const barberDoc = await getDoc(doc(db, 'users', params.barberId))
        if (!barberDoc.exists()) {
          toast.error('Barbero no encontrado')
          router.push('/client/dashboard')
          return
        }

        setBarber({
          id: barberDoc.id,
          ...barberDoc.data()
        } as Barber)
      } catch (error) {
        console.error('Error al cargar barbero:', error)
        toast.error('Error al cargar la información del barbero')
        router.push('/client/dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadBarber()
  }, [router, params.barberId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !time || !barber) return

    setSaving(true)
    try {
      const firebaseUser = await getCurrentUser()
      if (!firebaseUser) throw new Error('No autenticado')

      const userData = await getUserData(firebaseUser.uid)
      if (!userData) throw new Error('Usuario no encontrado')

      // Crear la cita
      await addDoc(collection(db, 'appointments'), {
        barberId: barber.id,
        barberName: barber.name,
        clientId: firebaseUser.uid,
        clientName: userData.name,
        date: format(date, 'yyyy-MM-dd'),
        time: time,
        status: 'pending',
        createdAt: new Date().toISOString()
      })

      toast.success('Cita agendada correctamente')
      router.push('/client/dashboard')
    } catch (error) {
      console.error('Error al agendar cita:', error)
      toast.error('Error al agendar la cita')
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

  if (!barber) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 p-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={barber.imageUrl} />
              <AvatarFallback>{barber.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>Agendar cita con {barber.name}</CardTitle>
              <CardDescription>
                {barber.experience} años de experiencia
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Fecha de la cita</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => 
                        date < new Date() || 
                        date.getDay() === 0 // Domingo
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Hora de la cita</Label>
                <Select onValueChange={setTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una hora">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {time || "Selecciona una hora"}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={!date || !time || saving}
              >
                {saving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Agendando...
                  </>
                ) : (
                  'Confirmar Cita'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 