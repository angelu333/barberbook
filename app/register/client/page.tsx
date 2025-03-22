"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/icons'
import { AnimatedButton } from '@/components/ui/animated-button'
import { createUser } from '@/lib/auth'

export default function RegisterClientPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string

    try {
      const { user, error } = await createUser(email, password, 'client', {
        name,
        phone,
        email
      })
      
      if (error) {
        setError(error)
        return
      }

      if (user) {
        router.push('/client/dashboard')
      }
    } catch (error: any) {
      setError('Error al registrar: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo con la imagen */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative overflow-hidden">
        <img
          src="/barber-register.jpg"
          alt="Barber Shop"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="relative z-10 p-12 text-white">
          <h1 className="text-4xl font-bold mb-4">BarberBook</h1>
          <p className="text-lg">Regístrate como cliente y comienza a reservar tus citas</p>
        </div>
      </div>

      {/* Panel derecho con el formulario */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 p-8 lg:p-12">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Registro de Cliente</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Crea tu cuenta para empezar a reservar
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                name="name"
                placeholder="Tu nombre completo"
                required
                type="text"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                placeholder="ejemplo@correo.com"
                required
                type="email"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+1234567890"
                required
                type="tel"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                required
                type="password"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <AnimatedButton
              type="submit"
              disabled={isLoading}
              className="w-full"
              variant="default"
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Registrarse
            </AnimatedButton>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => router.push('/login')}
              disabled={isLoading}
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 