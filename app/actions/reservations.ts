'use server'

import prisma from '@/lib/prisma'

export async function cancelReservation(reservationId: number) {
  try {
    await prisma.reservation.update({
      where: { id: reservationId },
      data: { etat: false }
    })
    return { success: true }
  } catch (error) {
    console.error('Erreur lors de l\'annulation:', error)
    return { success: false }
  }
} 