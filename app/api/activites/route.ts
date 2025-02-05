import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const { nom, description, typeId, placesDisponibles, datetimeDebut, duree } = await request.json()
    const activite = await prisma.activite.create({
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
    console.error('Erreur création activité:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const typeId = searchParams.get('typeId')
    const sort = searchParams.get('sort')

    let where = {}
    if (search) {
      where = {
        OR: [
          { nom: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }
    }
    if (typeId) {
      where = { ...where, typeId: parseInt(typeId) }
    }

    let orderBy: any = { datetimeDebut: 'asc' }
    if (sort === 'places') {
      orderBy = { placesDisponibles: 'desc' }
    }

    const activites = await prisma.activite.findMany({
      where,
      include: {
        type: true,
        reservations: {
          where: { etat: true }
        }
      },
      orderBy
    })

    return NextResponse.json(activites)
  } catch (error) {
    console.error('Erreur lors de la récupération des activités:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des activités' },
      { status: 500 }
    )
  }
} 