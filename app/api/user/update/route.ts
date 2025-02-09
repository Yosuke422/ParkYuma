import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Session invalide' }, { status: 401 })
    }

    const { prenom, nom, email } = await req.json()
    
    if (!prenom || !nom || !email) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    const userId = Number(session.user.id)
    
    if (isNaN(userId)) {
      console.error('ID utilisateur invalide:', session.user.id)
      return NextResponse.json(
        { error: 'ID utilisateur invalide' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        prenom,
        nom,
        email
      },
      select: {
        id: true,
        prenom: true,
        nom: true,
        email: true,
        role: true
      }
    })

    return NextResponse.json({
      message: 'Utilisateur mis à jour avec succès',
      user: updatedUser
    })

  } catch (error) {
    console.error('Erreur détaillée:', error)
    
    if ((error as any).code === 'P2002') {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Erreur lors de la mise à jour',
        message: (error as Error).message
      },
      { status: 500 }
    )
  }
} 