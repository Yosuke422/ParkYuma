// app/api/user/reservations/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET() {
  // Get the user session
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  // Find the user in the database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
  }

  // Fetch the user's reservations including the associated activity data
  const reservations = await prisma.reservation.findMany({
    where: { userId: user.id },
    include: { activite: true }
  })

  return NextResponse.json({ reservations })
}
