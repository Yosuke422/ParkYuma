import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
    }

    const activite = await prisma.activite.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!activite) {
      return NextResponse.json({ error: 'Activité non trouvée' }, { status: 404 })
    }

    if (activite.placesDisponibles < 1) {
      return NextResponse.json({ error: 'Plus de places disponibles' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    const reservation = await prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.create({
        data: {
          userId: user!.id,
          activiteId: activite.id,
          etat: true
        }
      })
      await tx.activite.update({
        where: { id: activite.id },
        data: {
          placesDisponibles: { decrement: 1 }
        }
      })
      return reservation
    })

    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Erreur réservation:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
