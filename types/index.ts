import { Prisma } from '.prisma/client'

export interface TypeActivite {
  id: number
  nom: string
}

export interface Activite {
  id: number
  nom: string
  description: string
  typeId: number
  placesDisponibles: number
  datetimeDebut: string
  duree: number
}

export interface ActiviteWithType extends Activite {
  type: TypeActivite
  reservations?: any[]
}

export type ReservationWithActivite = Prisma.ReservationGetPayload<{
  include: { activite: true }
}>

export type UserWithReservations = Prisma.UserGetPayload<{
  include: {
    reservations: {
      include: { activite: true }
    }
  }
}> 