
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET() {
  
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })
  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
  }
  const reservations = await prisma.reservation.findMany({
    where: { userId: user.id },
    include: { activite: true }
  })

  return NextResponse.json({ reservations })
}
