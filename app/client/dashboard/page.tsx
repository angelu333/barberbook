import { CalendarDays, Clock, MapPin, Scissors } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BarberCard } from "@/components/barber-card"

// Mock data for upcoming appointments
const upcomingAppointments = [
  {
    id: 1,
    barberName: "Carlos Rodríguez",
    barberImage:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    shopName: "Barbería Estilo",
    date: "15 de Junio, 2024",
    time: "10:00 AM",
    address: "Av. Principal 123, Ciudad",
  },
  {
    id: 2,
    barberName: "Miguel Ángel",
    barberImage:
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    shopName: "Cortes Modernos",
    date: "22 de Junio, 2024",
    time: "3:30 PM",
    address: "Calle Secundaria 456, Ciudad",
  },
]

// Mock data for suggested barbers
const suggestedBarbers = [
  {
    id: 1,
    name: "Roberto Gómez",
    image:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    shopName: "Barbería Clásica",
    rating: 4.8,
    distance: "1.2 km",
    specialty: "Cortes clásicos y modernos",
  },
  {
    id: 2,
    name: "Juan Pérez",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    shopName: "Estilo Urbano",
    rating: 4.7,
    distance: "2.5 km",
    specialty: "Degradados y diseños",
  },
  {
    id: 3,
    name: "Alejandro Torres",
    image:
      "https://images.unsplash.com/photo-1593702288056-f5834cfbef26?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    shopName: "Barber Shop",
    rating: 4.9,
    distance: "3.1 km",
    specialty: "Barbas y cortes tradicionales",
  },
]

export default function ClientDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bienvenido, Juan</h2>
        <p className="text-muted-foreground">Gestiona tus citas y encuentra los mejores barberos</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Próximas citas</h3>
        {upcomingAppointments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="overflow-hidden border-primary/20 hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center gap-4 pb-2 bg-primary/5">
                  <img
                    src={appointment.barberImage || "/placeholder.svg"}
                    alt={appointment.barberName}
                    className="h-12 w-12 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div>
                    <CardTitle className="text-base">{appointment.barberName}</CardTitle>
                    <CardDescription>{appointment.shopName}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 pt-4">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{appointment.address}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-muted/10 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600"
                  >
                    Cancelar
                  </Button>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Modificar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <Scissors className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No tienes citas programadas</h3>
              <p className="mt-2 text-sm text-muted-foreground">Reserva una cita con tu barbero favorito</p>
              <Button className="mt-4">Reservar cita</Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Barberos sugeridos cerca de ti</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suggestedBarbers.map((barber) => (
            <BarberCard key={barber.id} barber={barber} />
          ))}
        </div>
      </div>
    </div>
  )
}

