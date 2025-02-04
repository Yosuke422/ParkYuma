import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hash } from 'bcrypt'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Données reçues:', body)
    const { email, password, prenom, nom } = body

    // Vérification des champs requis
    if (!email || !password || !prenom || !nom) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Vérification si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    // Hashage du mot de passe
    const hashedPassword = await hash(password, 10)

    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        prenom,
        nom,
        role: 'USER'
      }
    })

    // On ne renvoie pas le mot de passe
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Erreur complète:', error)
    console.error('Erreur lors de l\'inscription:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    )
  }
} 