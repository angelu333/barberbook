interface User {
  id: string
  name: string
  email: string
  password: string
  role: "client" | "barber"
  phone: string
  image?: string
  experience?: number
  specialties?: string[]
  description?: string
  workImages?: string[]
}

// Datos de ejemplo (simulando una base de datos)
export const users: User[] = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@barber.com",
    password: "123456",
    role: "barber",
    phone: "+1234567890",
    image: "/barbers/juan.jpg",
    experience: 5,
    specialties: ["Corte clásico", "Fade", "Barba"],
    description: "Especialista en cortes modernos y clásicos",
    workImages: [
      "/gallery/juan-1.jpg",
      "/gallery/juan-2.jpg",
      "/gallery/juan-3.jpg"
    ]
  },
  {
    id: "2",
    name: "María García",
    email: "maria@barber.com",
    password: "123456",
    role: "barber",
    phone: "+1234567891",
    image: "/barbers/maria.jpg",
    experience: 7,
    specialties: ["Diseño de barba", "Fade", "Cortes texturizados"],
    description: "Experta en diseños personalizados",
    workImages: [
      "/gallery/maria-1.jpg",
      "/gallery/maria-2.jpg",
      "/gallery/maria-3.jpg"
    ]
  },
  {
    id: "3",
    name: "Carlos López",
    email: "carlos@cliente.com",
    password: "123456",
    role: "client",
    phone: "+1234567892"
  }
]

export function authenticateUser(email: string, password: string) {
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) {
    throw new Error("Credenciales incorrectas")
  }
  return user
}

export function getUserByEmail(email: string) {
  return users.find(u => u.email === email)
}

export function getBarbers() {
  return users.filter(u => u.role === "barber")
} 