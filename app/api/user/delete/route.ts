import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = Number(session.user.id)
    
    // Suppression de l'utilisateur
    await prisma.user.delete({
      where: { id: userId }
    })

    // Retourner une réponse avec un flag pour indiquer qu'il faut déconnecter
    return NextResponse.json({ 
      message: 'Compte supprimé',
      shouldLogout: true 
    })

  } catch (error) {
    console.error('Erreur de suppression:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
} 