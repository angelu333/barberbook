"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState("client")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

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
          <h1 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
          <p className="text-sm text-muted-foreground">Ingresa tus credenciales para acceder</p>
        </div>

        <Tabs defaultValue={role} onValueChange={setRole} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="client">Cliente</TabsTrigger>
            <TabsTrigger value="barber">Barbero</TabsTrigger>
          </TabsList>
          <TabsContent value="client">
            <Card>
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle>Cliente</CardTitle>
                  <CardDescription>Accede a tu cuenta para gestionar tus citas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-email">Correo electrónico</Label>
                    <Input id="client-email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-password">Contraseña</Label>
                    <Input id="client-password" type="password" required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Iniciar sesión
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="barber">
            <Card>
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle>Barbero</CardTitle>
                  <CardDescription>Accede a tu cuenta para gestionar tus citas y perfil</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="barber-email">Correo electrónico</Label>
                    <Input id="barber-email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barber-password">Contraseña</Label>
                    <Input id="barber-password" type="password" required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Iniciar sesión
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
        <p className="px-8 text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="underline underline-offset-4 hover:text-primary">
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  )
}

