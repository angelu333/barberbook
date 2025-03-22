"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUserData, UserData } from '@/lib/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Icons } from '@/components/icons'
import { toast } from 'sonner'

export default function BarberProfile() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    experience: 0,
    specialties: '',
    description: '',
  })

  useEffect(() => {
    async function loadProfile() {
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
        setFormData({
          name: userData.name || '',
          phone: userData.phone || '',
          experience: userData.experience || 0,
          specialties: userData.specialties?.join(', ') || '',
          description: userData.description || '',
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

