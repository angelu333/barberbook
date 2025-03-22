"use client"

import type React from "react"

import { useState } from "react"
import { CalendarDays, Clock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for user profile
const userProfile = {
  name: "Juan Pérez",
  email: "juan@example.com",
  phone: "+52 123 456 7890",
  avatar: "/placeholder.svg?height=100&width=100",
}

// Mock data for appointment history
const appointmentHistory = [
  {
    id: 1,
    barberName: "Carlos Rodríguez",
    barberImage: "/placeholder.svg?height=50&width=50",
    shopName: "Barbería Estilo",
    date: "10 de Mayo, 2024",
    time: "10:00 AM",
    status: "completed",
  },
  {
    id: 2,
    barberName: "Miguel Ángel",
    barberImage: "/placeholder.svg?height=50&width=50",
    shopName: "Cortes Modernos",
    date: "25 de Abril, 2024",
    time: "3:30 PM",
    status: "completed",
  },
  {
    id: 3,
    barberName: "Roberto Gómez",
    barberImage: "/placeholder.svg?height=50&width=50",
    shopName: "Barbería Clásica",
    date: "15 de Abril, 2024",
    time: "11:00 AM",
    status: "cancelled",
  },
]

export default function ProfilePage() {
  const [profile, setProfile] = useState(userProfile)

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate profile update
    alert("Perfil actualizado correctamente")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mi Perfil</h2>
        <p className="text-muted-foreground">Gestiona tu información personal y revisa tu historial</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="history">Historial de Citas</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Actualiza tus datos de contacto</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full">
                    <img
                      src={profile.avatar || "/placeholder.svg"}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0"
                    >
                      <User className="h-4 w-4" />
                      <span className="sr-only">Cambiar avatar</span>
                    </Button>
                  </div>

                  <div className="w-full space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phone">Teléfono (WhatsApp)</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button onClick={handleProfileUpdate} className="ml-auto">
                Guardar Cambios
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Citas</CardTitle>
              <CardDescription>Revisa tus citas anteriores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointmentHistory.map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`flex items-start space-x-4 rounded-lg border p-4 ${
                      appointment.status === "cancelled" ? "border-destructive/20 bg-destructive/10" : ""
                    }`}
                  >
                    <img
                      src={appointment.barberImage || "/placeholder.svg"}
                      alt={appointment.barberName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{appointment.barberName}</h3>
                        <span
                          className={`text-xs font-medium ${
                            appointment.status === "completed" ? "text-green-500" : "text-destructive"
                          }`}
                        >
                          {appointment.status === "completed" ? "Completada" : "Cancelada"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{appointment.shopName}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {appointmentHistory.length === 0 && (
                  <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
                    <CalendarDays className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No hay historial de citas</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Aún no has realizado ninguna cita</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

