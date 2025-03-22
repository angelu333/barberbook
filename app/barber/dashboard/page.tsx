"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getBarbers } from "@/lib/auth"

export default function BarberDashboard() {
  const barbers = getBarbers()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Panel de Control</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Citas Pendientes</CardTitle>
            <CardDescription>Tus próximas citas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clientes Totales</CardTitle>
            <CardDescription>Número de clientes atendidos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">150</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calificación</CardTitle>
            <CardDescription>Promedio de reseñas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4.8/5.0</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-6">Galería de Trabajos</h2>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {barbers[0].workImages?.map((image, index) => (
          <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
            <img
              src={image}
              alt={`Trabajo ${index + 1}`}
              className="object-cover w-full h-full hover:scale-105 transition-transform"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

