import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const types = await prisma.typeActivite.findMany({
      orderBy: {
        nom: 'asc'
      }
    })

    return NextResponse.json(types)
  } catch (error) {
    console.error('Erreur lors de la récupération des types:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des types' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { nom } = await req.json()
    
    const type = await prisma.typeActivite.create({
      data: { nom }
    })

    return NextResponse.json(type)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création du type' },
      { status: 500 }
    )
  }
} 