import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    const reservation = await prisma.reservation.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!reservation || reservation.userId !== user?.id) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      )
    }

    // Mise à jour de la réservation
    const updatedReservation = await prisma.reservation.update({
      where: { id: parseInt(params.id) },
      data: { etat: false }
    })

    // Mise à jour des places disponibles
    await prisma.activite.update({
      where: { id: reservation.activiteId },
      data: {
        placesDisponibles: {
          increment: 1
        }
      }
    })

    return NextResponse.json(updatedReservation)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de l\'annulation' },
      { status: 500 }
    )
  }
} 