import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const rendezVous = await prisma.rendezVous.findMany({
      select: {
        id: true,
        bookingId: true,
        nom: true,
        email: true,
        telephone: true,
        prestation: true,
        date: true,
        duree: true,
        status: true,
        createdAt: true
      },
      orderBy: { date: 'asc' }
    })
    return NextResponse.json(rendezVous)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}