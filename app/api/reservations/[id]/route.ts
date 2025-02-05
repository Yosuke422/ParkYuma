import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { sendEmail } from '@/lib/email'

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

    const reservation = await prisma.reservation.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        activite: true,
        user: true
      }
    })

    if (!reservation || reservation.user.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      )
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: parseInt(params.id) },
      data: { etat: false }
    })
    await prisma.activite.update({
      where: { id: reservation.activiteId },
      data: {
        placesDisponibles: {
          increment: 1
        }
      }
    })

    // Envoyer l'email d'annulation
    await sendEmail(
      session.user.email,
      reservation.activite.nom,
      reservation.activite.datetimeDebut.toISOString(),
      reservation.activite.duree
    )

    return NextResponse.json(updatedReservation)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de l\'annulation' },
      { status: 500 }
    )
  }
} 