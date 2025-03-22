"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Scissors, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VerificationDialog } from "@/components/verification-dialog"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") || "client"

  const [showVerification, setShowVerification] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState(defaultRole)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setShowVerification(true)
  }

  const handleVerificationSuccess = () => {
    // Redirect to the appropriate dashboard based on role
    // Use setTimeout to ensure state updates properly before navigation
    setTimeout(() => {
      if (role === "client") {
        router.push("/client/dashboard")
      } else {
        router.push("/barber/dashboard")
      }
    }, 0)
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost">Volver</Button>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Crear una cuenta</h1>
          <p className="text-sm text-muted-foreground">Ingresa tus datos para registrarte</p>
        </div>

        <Tabs defaultValue={role} onValueChange={setRole} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="client">
              <User className="mr-2 h-4 w-4" />
              Cliente
            </TabsTrigger>
            <TabsTrigger value="barber">
              <Scissors className="mr-2 h-4 w-4" />
              Barbero
            </TabsTrigger>
          </TabsList>
          <TabsContent value="client">
            <Card>
              <form onSubmit={handleRegister}>
                <CardHeader>
                  <CardTitle>Registro de Cliente</CardTitle>
                  <CardDescription>Crea tu cuenta para reservar citas con los mejores barberos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Nombre completo</Label>
                    <Input id="client-name" placeholder="Juan Pérez" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-email">Correo electrónico</Label>
                    <Input
                      id="client-email"
                      type="email"
                      placeholder="ejemplo@correo.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-phone">Teléfono (WhatsApp)</Label>
                    <Input id="client-phone" placeholder="+52 123 456 7890" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-password">Contraseña</Label>
                    <Input id="client-password" type="password" required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Registrarse
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="barber">
            <Card>
              <form onSubmit={handleRegister}>
                <CardHeader>
                  <CardTitle>Registro de Barbero</CardTitle>
                  <CardDescription>Crea tu cuenta para gestionar tus citas y mostrar tu trabajo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="barber-name">Nombre completo</Label>
                    <Input id="barber-name" placeholder="Juan Pérez" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barber-email">Correo electrónico</Label>
                    <Input
                      id="barber-email"
                      type="email"
                      placeholder="ejemplo@correo.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barber-phone">Teléfono (WhatsApp)</Label>
                    <Input id="barber-phone" placeholder="+52 123 456 7890" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barber-shop">Nombre de la barbería</Label>
                    <Input id="barber-shop" placeholder="Barbería Estilo" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barber-address">Dirección</Label>
                    <Input id="barber-address" placeholder="Calle Principal #123" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barber-password">Contraseña</Label>
                    <Input id="barber-password" type="password" required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Registrarse
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
        <p className="px-8 text-center text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Iniciar sesión
          </Link>
        </p>
      </div>
      <VerificationDialog
        open={showVerification}
        onOpenChange={setShowVerification}
        email={email}
        onSuccess={handleVerificationSuccess}
      />
    </div>
  )
}

