import Link from "next/link"
import { ArrowRight, Scissors, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-primary/5 to-background dark:from-primary/10 dark:to-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <span className="text-xl text-primary">BarberBook</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="container px-4 md:px-6 py-10 md:py-14">
          <div className="flex flex-col items-center text-center space-y-10 md:space-y-16">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Reserva tu cita con los mejores barberos
              </h1>
              <p className="max-w-[800px] text-muted-foreground md:text-xl mx-auto">
                Encuentra a tu barbero ideal, reserva en minutos y luce un corte perfecto. Fácil, rápido y a tu medida.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 w-full max-w-md">
              <Link href="/register?role=client" className="w-full group">
                <Button
                  size="lg"
                  className="w-full text-lg py-8 relative overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex items-center justify-center gap-3">
                    <User className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-medium">Registrarse como Cliente</span>
                  </div>
                  <ArrowRight className="ml-2 h-5 w-5 absolute right-4 opacity-0 transform translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </Button>
              </Link>

              <Link href="/register?role=barber" className="w-full group">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full text-lg py-8 border-primary/20 hover:bg-primary/5 relative overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex items-center justify-center gap-3">
                    <Scissors className="h-6 w-6 transition-transform duration-300 group-hover:rotate-45" />
                    <span className="font-medium">Registrarse como Barbero</span>
                  </div>
                  <ArrowRight className="ml-2 h-5 w-5 absolute right-4 opacity-0 transform translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full border-t py-6 bg-muted/30">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm text-muted-foreground">© 2024 BarberBook. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

