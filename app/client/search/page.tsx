"use client"

import { useState } from "react"
import { MapPin, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarberCard } from "@/components/barber-card"

// Mock data for barbers
const allBarbers = [
  {
    id: 1,
    name: "Carlos Rodríguez",
    image:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    shopName: "Barbería Estilo",
    rating: 4.8,
    distance: "1.2 km",
    specialty: "Cortes clásicos y modernos",
  },
  {
    id: 2,
    name: "Miguel Ángel",
    image:
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    shopName: "Cortes Modernos",
    rating: 4.7,
    distance: "2.5 km",
    specialty: "Degradados y diseños",
  },
  {
    id: 3,
    name: "Roberto Gómez",
    image:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    shopName: "Barbería Clásica",
    rating: 4.8,
    distance: "1.2 km",
    specialty: "Cortes clásicos y modernos",
  },
  {
    id: 4,
    name: "Juan Pérez",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    shopName: "Estilo Urbano",
    rating: 4.7,
    distance: "2.5 km",
    specialty: "Degradados y diseños",
  },
  {
    id: 5,
    name: "Alejandro Torres",
    image:
      "https://images.unsplash.com/photo-1593702288056-f5834cfbef26?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    shopName: "Barber Shop",
    rating: 4.9,
    distance: "3.1 km",
    specialty: "Barbas y cortes tradicionales",
  },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter barbers based on search query and active tab
  const filteredBarbers = allBarbers.filter((barber) => {
    const matchesSearch =
      barber.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      barber.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      barber.specialty.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "nearby") return matchesSearch && Number.parseFloat(barber.distance) < 2
    if (activeTab === "top-rated") return matchesSearch && barber.rating >= 4.8

    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Buscar Barberos</h2>
        <p className="text-muted-foreground">Encuentra al barbero perfecto para tu próximo corte</p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre, barbería o estilo..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>Buscar</Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="nearby">Cercanos</TabsTrigger>
          <TabsTrigger value="top-rated">Mejor valorados</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{filteredBarbers.length} barberos encontrados</p>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Tu ubicación: Ciudad de México</span>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBarbers.map((barber) => (
              <BarberCard key={barber.id} barber={barber} />
            ))}
          </div>

          {filteredBarbers.length === 0 && (
            <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed">
              <Search className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No se encontraron resultados</h3>
              <p className="mt-2 text-sm text-muted-foreground">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="nearby" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{filteredBarbers.length} barberos encontrados</p>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Tu ubicación: Ciudad de México</span>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBarbers.map((barber) => (
              <BarberCard key={barber.id} barber={barber} />
            ))}
          </div>

          {filteredBarbers.length === 0 && (
            <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed">
              <MapPin className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No hay barberos cercanos</h3>
              <p className="mt-2 text-sm text-muted-foreground">Intenta ampliar tu radio de búsqueda</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="top-rated" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{filteredBarbers.length} barberos encontrados</p>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBarbers.map((barber) => (
              <BarberCard key={barber.id} barber={barber} />
            ))}
          </div>

          {filteredBarbers.length === 0 && (
            <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed">
              <Search className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No se encontraron resultados</h3>
              <p className="mt-2 text-sm text-muted-foreground">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

