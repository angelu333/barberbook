"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getCurrentUser, getUserData, UserData } from '@/lib/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Icons } from '@/components/icons'
import { toast } from 'sonner'
import { uploadImage } from '@/lib/upload'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ExtendedUserData extends UserData {
  id: string
  imageUrl?: string
}

export default function BarberProfile() {
  const router = useRouter()
  const [user, setUser] = useState<ExtendedUserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    experience: 0,
    specialties: '',
    description: '',
    imageUrl: ''
  })

  useEffect(() => {
    async function loadProfile() {
      try {
        const firebaseUser = await getCurrentUser()
        if (!firebaseUser) {
          router.push('/login')
          return
        }

        const userData = await getUserData(firebaseUser.uid) as ExtendedUserData
        if (!userData || userData.role !== 'barber') {
          router.push('/login')
          return
        }

        setUser(userData)
        setFormData({
          name: userData.name || '',
          phone: userData.phone || '',
          experience: userData.experience || 0,
          specialties: userData.specialties?.join(', ') || '',
          description: userData.description || '',
          imageUrl: userData.imageUrl || ''
        })
      } catch (error) {
        console.error('Error al cargar perfil:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    try {
      const imageUrl = await uploadImage(file)
      setFormData({ ...formData, imageUrl })
      
      // Actualizar el documento del usuario con la nueva URL
      const firebaseUser = await getCurrentUser()
      if (!firebaseUser) throw new Error('No autenticado')
      
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        imageUrl: imageUrl,
        updatedAt: new Date().toISOString()
      })

      toast.success('Imagen subida correctamente')
    } catch (error) {
      console.error('Error al subir imagen:', error)
      toast.error('Error al subir la imagen')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const firebaseUser = await getCurrentUser()
      if (!firebaseUser) {
        throw new Error('No se encontró usuario')
      }

      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        name: formData.name,
        phone: formData.phone,
        experience: formData.experience,
        specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s),
        description: formData.description,
        imageUrl: formData.imageUrl,
        updatedAt: new Date().toISOString()
      })

      toast.success('Perfil actualizado correctamente')
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      toast.error('Error al actualizar el perfil')
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6">Tu Perfil Profesional</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={formData.imageUrl} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="picture"
                />
                <Label
                  htmlFor="picture"
                  className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Cambiar Foto
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                El correo electrónico no se puede cambiar
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Tu nombre completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1234567890"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Años de Experiencia</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">Especialidades</Label>
              <Input
                id="specialties"
                type="text"
                value={formData.specialties}
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                placeholder="Corte clásico, Fade, Barba (separar por comas)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Cuéntanos sobre tu experiencia y estilo..."
                required
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full">
              {saving && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Guardar Cambios
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

