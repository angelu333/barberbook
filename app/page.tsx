"use client"

import Link from "next/link"
import { Scissors } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Bienvenido a <span className="text-primary">BarberBook</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  La forma más fácil de reservar tu cita con los mejores barberos
                </p>
              </div>
              <div className="grid w-full max-w-sm gap-4">
                <Link href="/auth/login">
                  <AnimatedButton className="w-full">
                    Iniciar Sesión
                  </AnimatedButton>
                </Link>
                <Link href="/auth/register/client">
                  <AnimatedButton variant="outline" className="w-full">
                    Registrarse como Cliente
                  </AnimatedButton>
                </Link>
                <Link href="/auth/register/barber">
                  <AnimatedButton variant="outline" className="w-full">
                    Registrarse como Barbero
                  </AnimatedButton>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex items-center justify-center py-4">
        <p className="text-center text-sm text-gray-500">
          © 2024 BarberBook. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  )
}

