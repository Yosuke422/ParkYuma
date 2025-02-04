import 'next-auth'
import { ReservationWithActivite } from './index'

declare module 'next-auth' {
  interface User {
    id: string
    role: string
    nom: string
    prenom: string
    reservations?: ReservationWithActivite[]
  }

  interface Session {
    user: User & {
      id: string
      role: string
      nom: string
      prenom: string
      reservations?: ReservationWithActivite[]
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    nom: string
    prenom: string
  }
} 