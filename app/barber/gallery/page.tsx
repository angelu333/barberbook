"use client"

import type React from "react"

import { useState } from "react"
import { ImagePlus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for gallery images
const initialImages = [
  {
    id: 1,
    url: "/placeholder.svg?height=300&width=300",
    title: "Corte clásico",
    description: "Corte elegante para ocasiones formales",
  },
  {
    id: 2,
    url: "/placeholder.svg?height=300&width=300",
    title: "Degradado moderno",
    description: "Estilo urbano con degradado perfecto",
  },
  {
    id: 3,
    url: "/placeholder.svg?height=300&width=300",
    title: "Barba completa",
    description: "Arreglo de barba con líneas definidas",
  },
  {
    id: 4,
    url: "/placeholder.svg?height=300&width=300",
    title: "Corte texturizado",
    description: "Estilo juvenil con mucha textura",
  },
]

export default function GalleryPage() {
  const [images, setImages] = useState(initialImages)
  const [newImage, setNewImage] = useState({
    title: "",
    description: "",
  })

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate image upload
    const newId = Math.max(0, ...images.map((img) => img.id)) + 1

    setImages([
      ...images,
      {
        id: newId,
        url: "/placeholder.svg?height=300&width=300",
        title: newImage.title,
        description: newImage.description,
      },
    ])

    // Reset form
    setNewImage({ title: "", description: "" })
  }

  const handleDeleteImage = (id: number) => {
    setImages(images.filter((img) => img.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Galería de Trabajos</h2>
        <p className="text-muted-foreground">Muestra tus mejores cortes y estilos</p>
      </div>

      <Tabs defaultValue="gallery">
        <TabsList>
          <TabsTrigger value="gallery">Galería</TabsTrigger>
          <TabsTrigger value="upload">Subir Imagen</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="relative aspect-square">
                  <img src={image.url || "/placeholder.svg"} alt={image.title} className="h-full w-full object-cover" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium">{image.title}</h3>
                  <p className="text-sm text-muted-foreground">{image.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {images.length === 0 && (
            <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed">
              <ImagePlus className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No hay imágenes</h3>
              <p className="mt-2 text-sm text-muted-foreground">Comienza a subir imágenes de tus mejores trabajos</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleAddImage} className="space-y-4">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border border-dashed">
                    <ImagePlus className="h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Arrastra una imagen o haz clic para seleccionar
                    </p>
                    <Input type="file" accept="image/*" className="mt-4 w-auto" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newImage.title}
                    onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                    placeholder="Ej. Corte moderno"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={newImage.description}
                    onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                    placeholder="Ej. Degradado con líneas definidas"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Subir Imagen
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

