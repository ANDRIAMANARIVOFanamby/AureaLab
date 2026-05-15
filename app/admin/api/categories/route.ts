import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Récupérer toutes les catégories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        services: true
      }
    })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer une catégorie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, icon, order, isActive } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Nom et slug requis' }, { status: 400 })
    }

    const lastCategory = await prisma.category.findFirst({
      orderBy: { order: 'desc' }
    })
    const nextOrder = lastCategory ? lastCategory.order + 1 : 1

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || '',
        icon: icon || '📌',
        order: order || nextOrder,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json({ success: true, category })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT - Modifier une catégorie
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, slug, description, icon, order, isActive } = body

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, description, icon, order, isActive }
    })

    return NextResponse.json({ success: true, category })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer une catégorie
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      // Vérifier si la catégorie a des services
      const category = await prisma.category.findUnique({
        where: { id },
        include: { services: true }
      })
      
      if (category && category.services.length > 0) {
        return NextResponse.json({ 
          error: 'Impossible de supprimer : cette catégorie contient des services' 
        }, { status: 400 })
      }
      
      await prisma.category.delete({ where: { id } })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}