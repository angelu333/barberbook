"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUserData, UserData } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BarberDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const firebaseUser = await getCurrentUser()
        if (!firebaseUser) {
          router.push('/login')
          return
        }

        const userData = await getUserData(firebaseUser.uid)
        if (!userData || userData.role !== 'barber') {
          router.push('/login')
          return
        }

        setUser(userData)
      } catch (error) {
        console.error('Error al verificar autenticación:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4">Bienvenido, {user?.name}</h1>
          <div className="grid gap-4">
            <div className="p-4 bg-background rounded-md">
              <h2 className="text-xl font-semibold mb-2">Información Personal</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Email:</span> {user?.email}</p>
                <p><span className="font-medium">Teléfono:</span> {user?.phone}</p>
                <p><span className="font-medium">Experiencia:</span> {user?.experience} años</p>
                <p><span className="font-medium">Especialidades:</span> {user?.specialties?.join(', ')}</p>
                <p><span className="font-medium">Descripción:</span> {user?.description}</p>
              </div>
            </div>

            {/* Aquí irán las citas del día */}
            <div className="p-4 bg-background rounded-md">
              <h2 className="text-xl font-semibold mb-2">Citas de Hoy</h2>
              <p className="text-muted-foreground">No tienes citas programadas para hoy.</p>
            </div>

            {/* Aquí irán las próximas citas */}
            <div className="p-4 bg-background rounded-md">
              <h2 className="text-xl font-semibold mb-2">Próximas Citas</h2>
              <p className="text-muted-foreground">No tienes citas programadas.</p>
            </div>

            {/* Aquí irá el historial de citas */}
            <div className="p-4 bg-background rounded-md">
              <h2 className="text-xl font-semibold mb-2">Historial de Citas</h2>
              <p className="text-muted-foreground">No hay historial de citas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

