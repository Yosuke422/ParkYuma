import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const { nom, description, typeId, placesDisponibles, datetimeDebut, duree } = await request.json()
    const activite = await prisma.activite.update({
      where: { id: parseInt(params.id) },
      data: {
        nom,
        description,
        typeId,
        placesDisponibles,
        datetimeDebut: new Date(datetimeDebut),
        duree
      },
      include: {
        type: true
      }
    })
    return NextResponse.json(activite)
  } catch (error) {
    console.error('Erreur modification activité:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    await prisma.activite.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur suppression activité:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
} 