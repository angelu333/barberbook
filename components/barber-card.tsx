import Link from "next/link"
import { MapPin, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Barber {
  id: number
  name: string
  image: string
  shopName: string
  rating: number
  distance: string
  specialty: string
}

interface BarberCardProps {
  barber: Barber
}

export function BarberCard({ barber }: BarberCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <img src={barber.image || "/placeholder.svg"} alt={barber.name} className="h-full w-full object-cover" />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg">{barber.name}</CardTitle>
        <CardDescription>{barber.shopName}</CardDescription>
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{barber.rating}</span>
          <span className="text-sm text-muted-foreground">• {barber.distance}</span>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{barber.specialty}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/client/barber/${barber.id}`}>Ver perfil</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={`/client/book?barberId=${barber.id}`}>Reservar</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

