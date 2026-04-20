import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile, unlink } from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

// GET - Récupérer toutes les images
export async function GET() {
  try {
    const gallery = await prisma.gallery.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(gallery)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Ajouter une image
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const file = formData.get('image') as File

    if (!title || !category || !file) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }

    // Sauvegarder l'image
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${Date.now()}-${file.name}`
    const filepath = path.join(process.cwd(), 'public', 'gallery', filename)
    
    await writeFile(filepath, buffer)

    // Sauvegarder en base
    const gallery = await prisma.gallery.create({
      data: {
        title,
        description: description || '',
        image: `/gallery/${filename}`,
        category,
        order: await getNextOrder()
      }
    })

    return NextResponse.json({ success: true, gallery })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT - Modifier une image
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, category, order } = body

    const gallery = await prisma.gallery.update({
      where: { id },
      data: { title, description, category, order }
    })

    return NextResponse.json({ success: true, gallery })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer une image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')

    const gallery = await prisma.gallery.findUnique({ where: { id } })
    if (gallery) {
      // Supprimer le fichier
      const filepath = path.join(process.cwd(), 'public', gallery.image)
      try {
        await unlink(filepath)
      } catch (e) {
        console.error('Erreur suppression fichier:', e)
      }
      
      await prisma.gallery.delete({ where: { id } })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

async function getNextOrder() {
  const last = await prisma.gallery.findFirst({
    orderBy: { order: 'desc' }
  })
  return last ? last.order + 1 : 1
}