"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Clock, GalleryThumbnailsIcon as Gallery, Home, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function BarberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/barber/dashboard",
      label: "Agenda",
      icon: Home,
      active: pathname === "/barber/dashboard",
    },
    {
      href: "/barber/appointments",
      label: "Citas",
      icon: Calendar,
      active: pathname === "/barber/appointments",
    },
    {
      href: "/barber/schedule",
      label: "Horarios",
      icon: Clock,
      active: pathname === "/barber/schedule",
    },
    {
      href: "/barber/gallery",
      label: "Galería",
      icon: Gallery,
      active: pathname === "/barber/gallery",
    },
    {
      href: "/barber/profile",
      label: "Perfil",
      icon: User,
      active: pathname === "/barber/profile",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Link href="/barber/dashboard">
              <span className="text-xl">BarberBook</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/">
              <Button variant="outline" size="sm">
                Cerrar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <nav className="flex flex-col space-y-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    route.active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">{children}</main>
      </div>
      <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background md:hidden">
        <div className="flex h-16 items-center justify-around">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium",
                route.active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

