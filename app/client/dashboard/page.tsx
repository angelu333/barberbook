"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getUserData, UserData } from "@/lib/auth"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User } from "lucide-react"

interface Barber extends UserData {
  id: string
  experience: number
  specialties: string[]
  description: string
}

export default function ClientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
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

        setUser(userData)

        // Cargar barberos
        const barbersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'barber')
        )
        const barbersSnapshot = await getDocs(barbersQuery)
        const barbersData = barbersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as unknown as Barber[]
        
        setBarbers(barbersData)
      } catch (error) {
        console.error('Error al cargar dashboard:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [router])

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
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bienvenido, {user?.name}</h1>
            <p className="text-muted-foreground">
              Encuentra al mejor barbero para tu estilo
            </p>
          </div>
          <Button onClick={() => router.push('/client/profile')}>
            <User className="mr-2 h-4 w-4" />
            Mi Perfil
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {barbers.map((barber) => (
            <Card key={barber.id}>
              <CardHeader>
                <CardTitle>{barber.name}</CardTitle>
                <CardDescription>
                  {barber.experience} años de experiencia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Especialidades:</h4>
                    <div className="flex flex-wrap gap-2">
                      {barber.specialties?.map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Descripción:</h4>
                    <p className="text-sm text-muted-foreground">
                      {barber.description}
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => router.push(`/client/book/${barber.id}`)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar Cita
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

