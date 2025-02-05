

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route' 

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  try {
    await prisma.reservation.deleteMany({
      where: { userId: Number(session.user.id) } 
    })
    await prisma.user.delete({
      where: { email: session.user.email }
    })
    return NextResponse.json({ message: 'Account deleted successfully' })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json({ error: 'Error deleting account' }, { status: 500 })
  }
}
