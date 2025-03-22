"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Save, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

// Mock data for barber profile
const barberProfile = {
  name: "Carlos Rodríguez",
  email: "carlos@example.com",
  phone: "+52 123 456 7890",
  shopName: "Barbería Estilo",
  address: "Av. Principal 123, Ciudad",
  bio: "Especialista en cortes clásicos y modernos con más de 10 años de experiencia.",
  avatar: "/placeholder.svg?height=100&width=100",
  services: [
    { id: 1, name: "Corte de cabello", price: "200" },
    { id: 2, name: "Arreglo de barba", price: "150" },
    { id: 3, name: "Corte + Barba", price: "300" },
  ],
}

export default function BarberProfilePage() {
  const [profile, setProfile] = useState(barberProfile)
  const [services, setServices] = useState(barberProfile.services)
  const [newService, setNewService] = useState({ name: "", price: "" })

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate profile update
    alert("Perfil actualizado correctamente")
  }

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault()

    if (newService.name && newService.price) {
      const newId = Math.max(0, ...services.map((s) => s.id)) + 1
      setServices([...services, { id: newId, ...newService }])
      setNewService({ name: "", price: "" })
    }
  }

  const handleRemoveService = (id: number) => {
    setServices(services.filter((service) => service.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mi Perfil</h2>
        <p className="text-muted-foreground">Gestiona tu información personal y servicios</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Actualiza tus datos de contacto y perfil</CardDescription>
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

                <Separator />

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="shopName">Nombre de la barbería</Label>
                    <Input
                      id="shopName"
                      value={profile.shopName}
                      onChange={(e) => setProfile({ ...profile, shopName: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="address">Dirección</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bio">Biografía</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button onClick={handleProfileUpdate} className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Servicios</CardTitle>
              <CardDescription>Gestiona los servicios que ofreces</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 p-4 font-medium">
                    <div className="col-span-6">Servicio</div>
                    <div className="col-span-4">Precio (MXN)</div>
                    <div className="col-span-2 text-right">Acciones</div>
                  </div>
                  <Separator />
                  {services.map((service) => (
                    <div key={service.id} className="grid grid-cols-12 gap-4 p-4">
                      <div className="col-span-6">{service.name}</div>
                      <div className="col-span-4">${service.price}</div>
                      <div className="col-span-2 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveService(service.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <form onSubmit={handleAddService} className="space-y-4">
                  <h3 className="text-lg font-medium">Agregar nuevo servicio</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="serviceName">Nombre del servicio</Label>
                      <Input
                        id="serviceName"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        placeholder="Ej. Corte de cabello"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="servicePrice">Precio (MXN)</Label>
                      <Input
                        id="servicePrice"
                        value={newService.price}
                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                        placeholder="Ej. 200"
                      />
                    </div>
                  </div>
                  <Button type="submit">Agregar Servicio</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

