import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

interface Params {
  params: {
    id: string
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const activiteId = parseInt(params.id, 10)
  const userId = parseInt(session.user.id as string, 10)

  try {
    // Check if reservation exists for this user & activité
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        activiteId,
        userId,
      },
    })

    if (!existingReservation) {
      return NextResponse.json(
        { error: "Aucune réservation à annuler" },
        { status: 400 }
      )
    }

    // Delete the reservation
    await prisma.reservation.delete({
      where: { id: existingReservation.id },
    })

    return NextResponse.json({ message: 'Réservation annulée avec succès !' })
  } catch (err) {
    console.error('Error deleting reservation:', err)
    return NextResponse.json(
      { error: 'Erreur lors de l\'annulation' },
      { status: 500 }
    )
  }
}
